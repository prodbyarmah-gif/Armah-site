import { useI18n } from '../i18n';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

const FACT_KEYS = ['base', 'roots', 'sound', 'project'] as const;
const PARAGRAPH_KEYS = ['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4'] as const;
const BIO_IMAGE = '/assets/bio-main.jpg';

export default function About(): JSX.Element {
  const { t } = useI18n();

  return (
    <section id="about" className="relative w-full overflow-hidden bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="relative min-h-[480px] overflow-hidden border border-white/10 bg-[#050505] sm:min-h-[560px]">
            <img
              src={BIO_IMAGE}
              alt="Armah portrait"
              className="absolute inset-0 h-full w-full object-cover object-[50%_54%] opacity-92"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.72))]" />
            <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
              DJ / Producer
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="max-w-[12ch] font-head text-5xl uppercase leading-none text-white sm:text-6xl">
                ARMAH
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/64">
                Hamburg sound, Ghanaian roots, built for real movement.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-armah-red">
              {t('about.eyebrow')}
            </span>
            <h2 className="mt-4 max-w-2xl font-head text-4xl uppercase tracking-tight text-white md:text-6xl lg:text-7xl">
              {t('about.title')}
            </h2>
            <div className="mt-6 h-0.5 w-20 bg-armah-red" />
            <p className="mt-7 max-w-3xl text-xl leading-8 text-white/82 md:text-2xl md:leading-9">
              {t('about.short')}
            </p>

            <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FACT_KEYS.map((key) => (
                <RevealItem key={key}>
                  <div className="border-l border-armah-red/55 bg-white/[0.025] px-4 py-3">
                    <p className="text-sm leading-6 text-white/70">{t(`about.facts.${key}`)}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="mt-8 space-y-4 border-l border-white/10 pl-5 md:pl-7">
              {PARAGRAPH_KEYS.map((key) => (
                <p key={key} className="text-sm leading-7 text-white/58 md:text-base md:leading-8">
                  {t(`about.${key}`)}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
