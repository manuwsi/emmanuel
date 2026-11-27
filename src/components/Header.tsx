'use client';

import Link from 'next/link';
import ArrowOut from './ArrowOut';
import { useLang, useT } from './i18n';
import DotText from './dot/DotText';
import { ChapterCrumb, ReadingMark } from './dot/Reading';
import { Mark } from './SoutrameMarks';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Shared site chrome, in the corners of the screen:
 * breadcrumb top-left, language top-right, text logo bottom-left, navigation bottom-right.
 * No background: mix-blend-difference keeps it legible over white pages and over images alike.
 */
export default function Header({ active, crumb }: { active?: 'work' | 'about'; crumb?: string }) {
  const { lang, setLang } = useLang();
  const t = useT();
  const corner = 'fixed z-50 text-white mix-blend-difference text-[13px] leading-[1.35] px-2 md:px-3';
  const link = (on: boolean) => (on ? 'underline underline-offset-2' : 'underline-offset-2');
  const here = crumb ?? (active === 'about' ? t('À propos', 'About') : t('Travaux', 'Work'));
  const pathname = usePathname() ?? '';
  const soutrame = pathname.startsWith('/soutrame');
  // a section that brings its own ink to the top of the screen (data-top-dark) lifts the white veil while it passes under the breadcrumb
  const [veil, setVeil] = useState(true);
  useEffect(() => {
    const els = document.querySelectorAll('[data-top-dark]');
    if (!els.length) return;
    const under = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
        setVeil(under.size === 0);
      },
      { rootMargin: '0px 0px -97% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      {/* the page dissolves under the breadcrumb, so text never runs into it (the bottom bar stays transparent) */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-10 bg-gradient-to-b from-white from-30% to-transparent transition-opacity duration-300 md:h-11" style={{ opacity: veil ? 1 : 0 }} />
      <div className={`${corner} left-0 top-0 whitespace-nowrap py-1.5`}>
        <Link href="/" className="underline-offset-2">
          <DotText text="Emmanuel Ijjou" play="intro" />
        </Link>{' '}
        → <DotText text={here} play="mount" delay={120} />
        {crumb && <ChapterCrumb />}
      </div>

      <div className={`${corner} right-0 top-0 py-1.5`} role="group" aria-label={t('Langue', 'Language')}>
        {(['fr', 'en'] as const).map((l, i) => (
          <span key={l}>
            {i > 0 && <span className="opacity-50"> / </span>}
            <button type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`uppercase ${lang === l ? '' : 'opacity-50'}`}>
              {l}
            </button>
          </span>
        ))}
      </div>

      <Link href="/" className={`${corner} bottom-0 left-0 flex items-end gap-2 pb-1`} aria-label={t('Accueil', 'Home')}>
        <span className="block text-[15px] font-bold uppercase leading-none tracking-[-0.045em] min-[380px]:text-[16px] md:text-[18px]">
          <DotText text="Emmanuel Ijjou" play="intro" delay={200} />
        </span>
        <span className="mb-[1px]">{soutrame ? <Mark className="h-[15px] w-[19px] md:h-[19px] md:w-[24px]" /> : <ReadingMark />}</span>
      </Link>

      <nav className={`${corner} bottom-0 right-0 flex gap-3 pb-1.5 sm:gap-4`}>
        <Link href="/" className={`${link(active === 'work')} hidden sm:inline`}>
          <DotText text={t('Travaux', 'Work')} play="intro" delay={260} />
        </Link>
        <Link href="/about" className={link(active === 'about')}>
          <DotText text={t('À propos', 'About')} play="intro" delay={320} />
        </Link>
        <Link href="/soutrame" className={link(false)}>
          <DotText text="Soutrame" play="intro" delay={380} />
          <ArrowOut />
        </Link>
        <a href="mailto:emmanuelijjou@gmail.com" className={link(false)}>
          <DotText text="Contact" play="intro" delay={440} />
        </a>
      </nav>
    </>
  );
}
