import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NAV_LINKS, firstNavLinkIn } from '../src/lib/navigation.ts';

test('approved navigation order starts with BIO and ends with BOOKING', () => {
  assert.deepEqual(
    NAV_LINKS.map((link) => link.key),
    ['about', 'live', 'mixes', 'shows', 'producer', 'booking'],
  );
  assert.deepEqual(
    NAV_LINKS.map((link) => link.href),
    ['#about', '#live', '#mixes', '#shows', '#producer', '#booking'],
  );
});

test('opening the mobile menu focuses a navigation link, never the language select', () => {
  const seen: string[] = [];
  const link = { tagName: 'A' };
  const menu = {
    querySelector: (selector: string) => {
      seen.push(selector);
      return link;
    },
  };
  assert.equal(firstNavLinkIn(menu as never), link);
  // The selector must target links only: a select-first selector is what
  // auto-opened the native language picker on mobile browsers.
  assert.ok(seen.every((selector) => !selector.includes('select')));
  assert.equal(firstNavLinkIn(null), null);
  assert.equal(firstNavLinkIn(undefined), null);
});

test('desktop header, mobile menu, and footer share the single nav definition', () => {
  for (const file of ['src/components/Navbar.tsx', 'src/components/Footer.tsx']) {
    const source = readFileSync(file, 'utf8');
    assert.match(source, /NAV_LINKS/);
  }
  const navbar = readFileSync('src/components/Navbar.tsx', 'utf8');
  // No private second ordering beside the shared definition.
  assert.doesNotMatch(navbar, /key:\s*'(about|live|mixes|shows|producer|booking)'/);
});
