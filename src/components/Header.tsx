'use client';

import Link from 'next/link';
import ArrowOut from './ArrowOut';
import ProjectMark from './ProjectMark';
import { useLang, useT } from './i18n';
import DotText from './dot/DotText';
import ReadProgress from './dot/ReadProgress';

/**
 * Shared site chrome, in the corners of the screen:
 * breadcrumb top-left, language top-right, text logo bottom-left, navigation bottom-right.
 * No background: mix-blend-difference keeps it legible over white pages and over images alike.
 */
export default function Header({ active, crumb }: { active?: 'work' | 'about'; crumb?: string }) {
  const { lang, setLang } = useLang();
  const t = useT();
  const corner = 'fixed z-50 text-white mix-blend-difference text-[13px] leading-[1.35] px-2 md:px-3';
  const link = (on: boolean) => (on ? 'underline underline-offset-2' : 'hover:underline underline-offset-2');
  const here = crumb ?? (active === 'about' ? t('À propos', 'About') : t('Travaux', 'Work'));

  return (
    <>
      <div className={`${corner} left-0 top-0 py-1.5`}>
        <Link href="/" className="hover:underline underline-offset-2">
          <DotText text="Emmanuel Ijjou" play="mount hover" />
        </Link>{' '}
        → <DotText text={here} play="mount" delay={120} />
        {crumb && <ReadProgress />}
      </div>

      <div className={`${corner} right-0 top-0 py-1.5`} role="group" aria-label={t('Langue', 'Language')}>
        {(['fr', 'en'] as const).map((l, i) => (
          <span key={l}>
            {i > 0 && <span className="opacity-50"> / </span>}
            <button type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`uppercase ${lang === l ? '' : 'opacity-50 hover:opacity-100'}`}>
              {l}
            </button>
          </span>
        ))}
      </div>

      <Link href="/" className={`${corner} bottom-0 left-0 flex items-end gap-2 pb-1`} aria-label={t('Accueil', 'Home')}>
        <span className="block text-[15px] font-bold uppercase leading-none tracking-[-0.045em] min-[380px]:text-[17px] sm:text-[20px] md:text-[24px]">
          <DotText text="Emmanuel Ijjou" play="mount hover" delay={200} />
        </span>
        <span className="mb-[1px]"><ProjectMark /></span>
      </Link>

      <nav className={`${corner} bottom-0 right-0 flex gap-3 pb-1.5 sm:gap-4`}>
        <Link href="/" className={`${link(active === 'work')} hidden sm:inline`}>
          <DotText text={t('Travaux', 'Work')} play="mount hover" delay={260} />
        </Link>
        <Link href="/about" className={link(active === 'about')}>
          <DotText text={t('À propos', 'About')} play="mount hover" delay={320} />
        </Link>
        <Link href="/soutrame" className={link(false)}>
          <DotText text="Soutrame" play="mount hover" delay={380} />
          <ArrowOut />
        </Link>
        <a href="mailto:emmanuelijjou@gmail.com" className={link(false)}>
          <DotText text="Contact" play="mount hover" delay={440} />
        </a>
      </nav>
    </>
  );
}
