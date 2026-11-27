'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';

export default function Story() {
  const t = useT();
  const steps = [
    { f: 'scan', n: '01', k: t('Akihabara, 16 h', 'Akihabara, 4 pm'), title: t('Je scanne la carte', 'I scan the card'), big: '98 %', text: t('Foil reconnaît le jeu, la série et la langue.', 'Foil picks up the game, the set and the language.') },
    { f: 'ajout', n: '02', k: t('Au comptoir', 'At the counter'), title: t('Je note le prix en yens', 'I note the price in yen'), big: '168 000 ¥', text: t('L’appli le convertit en euros au taux du jour : 1 040 €. Ce prix reste fixe.', 'The app converts it to euros at that day’s rate: €1,040. This price stays fixed.') },
    { f: 'fiche', n: '03', k: t('Dans le train', 'On the train'), title: t('Je regarde ce qu’elle vaut', 'I check what it is worth'), big: '+ 200 €', text: t('Valeur du marché, écart avec le prix payé, et courbe sur quelques mois.', 'Market value, gap with the price paid, and a curve over a few months.') },
    { f: 'constellation', n: '04', k: t('Le soir', 'In the evening'), title: t('Elle rejoint la collection', 'It joins the collection'), big: '148', text: t('Un point de plus, parmi tous les jeux.', 'One more dot, among all the games.') },
    { f: 'vendre', n: '05', k: t('Dans trois ans', 'In three years'), title: t('Je décide de vendre', 'I decide to sell'), big: '+ 125 €', text: t('Le gain net, une fois les frais, l’envoi et le change retirés.', 'The net gain, once fees, shipping and exchange are taken off.') },
  ];
  const [a, setA] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setA(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-[#08090b] text-white grid grid-cols-1 md:grid-cols-12">
      <div className="md:col-span-5 md:order-2 md:sticky md:top-0 md:self-start md:h-screen flex items-center justify-center py-10 md:py-0"
        style={{ background: 'radial-gradient(90% 70% at 50% 0%, #17191e 0%, #08090b 70%)' }}>
        <div className="relative w-[min(300px,70vw)] aspect-[780/1688] rounded-[34px] overflow-hidden border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,.6)]">
          {steps.map((s, i) => (
            <Image unoptimized loading="eager" key={s.f} src={`/foil/p/${s.f}.webp`} alt={t(`Écran : ${s.title}`, `Screen: ${s.title}`)} width={780} height={1688} sizes="300px"
              className="absolute inset-0 w-full h-full transition-opacity duration-500" style={{ opacity: a === i ? 1 : 0 }} />
          ))}
        </div>
      </div>
      <div className="md:col-span-7 md:order-1">
        {steps.map((s, i) => (
          <div key={s.f} ref={(r) => { refs.current[i] = r; }} data-i={i}
            className="md:min-h-[56vh] flex flex-col justify-center px-6 md:px-14 py-14 border-t border-white/10 first:border-t-0">
            <span className="text-[12px] tracking-[0.08em] uppercase text-white/45">{s.n} · {s.k}</span>
            <h4 className="text-3xl md:text-4xl font-light tracking-[-0.035em] mt-3">{s.title}</h4>
            <div className="text-6xl md:text-7xl font-extralight tracking-[-0.045em] mt-8 tabular-nums" style={{ opacity: a === i ? 1 : 0.25, transition: 'opacity .5s' }}>{s.big}</div>
            <p className="text-[14px] md:text-[13px] text-white/60 leading-relaxed mt-6 max-w-sm">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
