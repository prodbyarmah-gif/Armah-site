import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler, { __resetBookingRateLimit } from '../api/bookings.ts';
import { bookingWasAccepted } from '../src/lib/bookingResponse.ts';

const envKeys = ['BOOKING_TO','GOOGLE_FROM_EMAIL','GOOGLE_FROM_NAME','GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','GOOGLE_REFRESH_TOKEN','MANAGER_EMAIL'];
const previous = Object.fromEntries(envKeys.map(key => [key,process.env[key]]));
const realFetch = globalThis.fetch;
let calls: { url: string; init?: RequestInit }[] = [];
let failPrimary = false, failReply = false;
beforeEach(() => {
  __resetBookingRateLimit();
  for (const key of envKeys) process.env[key] = key.includes('EMAIL') || key === 'BOOKING_TO' ? 'test@example.invalid' : 'test-only';
  process.env.MANAGER_EMAIL = '';
  calls = []; failPrimary = false; failReply = false;
  // Every network request is intercepted. This suite cannot call Gmail or OAuth.
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('/token')) return Response.json({access_token:'fake-token'});
    assert.match(String(url), /^https:\/\/gmail.googleapis.com\//);
    const sent = calls.filter(call => call.url.includes('/messages/send')).length;
    return new Response('{}', {status: failPrimary || (failReply && sent === 2) ? 503 : 200});
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
  for (const key of envKeys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
});
const valid = {name:'Test Booker',email:'booker@example.invalid',inquiryType:'dj',eventType:'club',location:'Hamburg',eventDate:'2026-12-12',message:'Test only',budget:'400–600 €',language:'en'};
async function submit(overrides = {}, method = 'POST') {
  let status = 200, body: unknown;
  const res = {setHeader(){},status(code:number){status=code;return this;},json(value:unknown){body=value;return this;},end(){return this;}};
  await handler({method,body:{...valid,...overrides},headers:{},socket:{}} as never,res as never);
  return {status,body};
}
test('rejects oversized payloads before any external call', async () => {
  const result = await submit({ message: 'x'.repeat(40000) });
  assert.equal(result.status, 413);
  assert.equal(calls.length, 0);
});
test('rate-limits rapid repeat submissions from one client', async () => {
  for (let i = 0; i < 5; i += 1) assert.equal((await submit()).status, 200);
  const limited = await submit();
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, { ok: false, error: 'Too many requests' });
});
test('HTTP success is insufficient without explicit JSON acceptance', async () => {
  for (const response of [new Response('<html>SPA</html>'),Response.json({ok:false}),Response.json({}),new Response(null,{status:204}),Response.json({ok:true},{status:500})]) assert.equal(await bookingWasAccepted(response),false);
  assert.equal(await bookingWasAccepted(Response.json({ok:true})),true);
});
for (const [name,payload] of Object.entries({
  honeypot:{company:'bot'},missingName:{name:''},invalidEmail:{email:'not-an-email'},
  invalidMode:{inquiryType:'unknown'},invalidEvent:{eventType:'unknown'},missingDate:{eventDate:''},invalidDate:{eventDate:'2026-02-30'},
  missingBeat:{inquiryType:'producer',eventType:'beat_license',beatId:''},
  headerInjection:{name:'Booker\r\nBcc: victim@example.invalid'},subjectInjection:{location:'Hamburg\nBcc: victim@example.invalid'},
})) test(`rejects ${name} before any external call`, async () => {
  const result=await submit(payload);assert.equal(result.status,400);assert.equal(calls.length,0);
});
test('accepts DJ inquiry and preserves its budget and date', async () => {
  assert.deepEqual(await submit(),{status:200,body:{ok:true}});
  const sends=calls.filter(call=>call.url.includes('/messages/send'));assert.equal(sends.length,2);
  const email=Buffer.from(JSON.parse(sends[0].init!.body as string).raw,'base64url').toString();
  assert.match(email,/400–600 €/);assert.match(email,/2026-12-12/);assert.match(email,/Reply-To: "Test Booker" <booker@example.invalid>/);
});
for (const language of ['en','de','fr','pt','es']) test(`producer inquiry retains beat selection in ${language}`,async()=>{
  const result=await submit({inquiryType:'producer',eventType:'beat_license',beatId:'23',beatTitle:'23',eventDate:'',language});
  assert.equal(result.status,200);assert.equal(calls.filter(call=>call.url.includes('/messages/send')).length,2);
});
test('primary Gmail failure never reports success',async()=>{failPrimary=true;assert.equal((await submit()).status,500);});
test('accepted inquiry stays successful if only the auto-reply fails',async()=>{
  failReply=true;const warn=console.warn;console.warn=()=>{};
  try{assert.deepEqual(await submit(),{status:200,body:{ok:true}});}finally{console.warn=warn;}
});
test('rejects unsupported HTTP methods without external requests',async()=>{assert.equal((await submit({},'GET')).status,405);assert.equal(calls.length,0);});
