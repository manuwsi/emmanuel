'use client';

import Link from 'next/link';
import { useLang, useT } from './i18n';

/** Shared site header: identity, navigation, FR/EN switch. */
export default function Header({ active }: { active?: 'work' | 'about' }) {
  const { lang, setLang } = useLang();
  const t = useT();

  const linkClass = (isActive: boolean) =>
    isActive
      ? 'line-through pointer-events-none'
      : 'hover:underline transition-all duration-300';

  return (
    <header className="fixed top-0 z-50 w-full px-4 md:px-10 py-4 flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 text-[0.65rem] md:text-sm uppercase tracking-wider mix-blend-difference">
      <span className="text-center">Emmanuel — Paris, France</span>
      <nav className="flex items-center space-x-5 md:space-x-8">
        <Link href="/" className={linkClass(active === 'work')}>
          [{t('Travaux', 'Work')}]
        </Link>
        <Link href="/about" className={linkClass(active === 'about')}>
          [{t('À propos', 'About')}]
        </Link>
        <a href="mailto:emmanuelijjou@gmail.com" className={linkClass(false)}>
          [Contact]
        </a>
        <span className="flex items-center gap-1 pl-1" role="group" aria-label={t('Langue', 'Language')}>
          {(['fr', 'en'] as const).map((l, i) => (
            <span key={l} className="flex items-center gap-1">
              {i > 0 && <span className="text-neutral-400">/</span>}
              <button
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`uppercase py-2 px-1 -my-2 transition-colors ${
                  lang === l ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            </span>
          ))}
        </span>
      </nav>
    </header>
  );
}
