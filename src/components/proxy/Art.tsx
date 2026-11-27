'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n';

const INK = '#0a0a0a';

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Trust, domain by domain. On day one every domain sits at "Proxy asks for everything";
 * when the line comes on screen, each one slides to where Léa has set it three weeks later.
 */
export function TrustLine() {
  const t = useT();
  const [ref, on] = useInView<HTMLDivElement>(0.4);
  const doms = [
    { name: t('Virements', 'Transfers'), x: 4 },
    { name: t('Courriels à un nouveau contact', 'Emails to a new contact'), x: 22 },
    { name: t('Achats au-dessus de 60 €', 'Purchases over €60'), x: 40 },
    { name: t('Agenda', 'Calendar'), x: 68 },
    { name: t('Classer des fichiers', 'Filing documents'), x: 94 },
  ];
  return (
    <figure ref={ref}>
      <div className="flex justify-between text-[14px] leading-[1.6] md:text-[13px]">
        <span>{t('Proxy demande tout', 'Proxy asks for everything')}</span>
        <span className="hidden tabular-nums text-black/60 md:inline">{on ? t("Trois semaines plus tard", "Three weeks later") : t("Premier jour", "Day one")}</span>
        <span>{t('Proxy agit en silence', 'Proxy acts silently')}</span>
      </div>
      <div className="relative mt-6 h-[150px] md:h-[110px]">
        <div className="absolute left-0 right-0 top-[9px] h-px bg-black/20" />
        <div className="absolute left-0 top-[4px] h-[11px] w-px bg-black/40" />
        <div className="absolute right-0 top-[4px] h-[11px] w-px bg-black/40" />
        {doms.map((d, i) => (
          <div
            key={d.name}
            className="absolute top-0"
            style={{
              left: `${on ? d.x : 1.5}%`,
              transform: 'translateX(-50%)',
              transition: `left 1.5s cubic-bezier(.65,0,.35,1) ${0.35 + i * 0.12}s`,
            }}
          >
            <span className="mx-auto block h-[19px] w-[19px] rounded-full border-[5px] border-white" style={{ background: INK }} />
            <span
              className="absolute w-[96px] text-[12px] leading-snug text-black/60 transition-opacity duration-500 md:w-[130px] md:text-[13px]"
              style={{
                top: i % 2 ? 70 : 30,
                left: i === 0 ? -4 : i === doms.length - 1 ? 'auto' : '50%',
                right: i === doms.length - 1 ? -4 : 'auto',
                transform: i === 0 || i === doms.length - 1 ? 'none' : 'translateX(-50%)',
                textAlign: i === 0 ? 'left' : i === doms.length - 1 ? 'right' : 'center',
                opacity: on ? 1 : 0,
                transitionDelay: `${1.6 + i * 0.12}s`,
              }}
            >
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
