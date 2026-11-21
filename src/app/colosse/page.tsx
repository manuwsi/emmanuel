'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Media } from '@/components/project/ProjectPage';
import { nextProject } from '@/components/projects';
import { useT } from '@/components/i18n';
import Cutter from '@/components/colosse/Cutter';
import Depth from '@/components/colosse/Depth';
import Scale from '@/components/colosse/Scale';
import Compare from '@/components/colosse/Compare';
import '@/styles/globals.css';

const W = { width: 2880, height: 1800, crisp: true };

/** A close-up of one screen, with its letter and one sentence. */
function Zoom({ k, title, src, w, h, alt, bare = false, children }: { k: string; title: string; src: string; w: number; h: number; alt: string; bare?: boolean; children: ReactNode }) {
  return (
    <figure>
      <div className={bare ? '' : 'border border-black/15'}>
        <Media src={src} alt={alt} width={w} height={h} crisp />
      </div>
      <figcaption className="mt-3 grid grid-cols-[28px_1fr] gap-x-2 text-[13px] leading-[1.45]">
        <span className="text-black/45">{k}</span>
        <span><span className="font-medium">{title}</span> <span className="text-black/60">{children}</span></span>
      </figcaption>
    </figure>
  );
}
const DISPLAY = { fontFamily: 'var(--font-general-sans), Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.03em' } as const;

function Chap({ n, title, depth, lede, children }: { n: number; title: string; depth: string; lede?: string; children?: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-80px' }}
      className="pt-28 pb-8 md:pt-40 md:pb-12"
    >
      <div className="flex items-baseline justify-between border-t border-black/15 pt-3">
        <h3 className="text-[13px] text-black/45">
          {String(n).padStart(2, '0')} → {title}
        </h3>
        <span className="text-[13px] tabular-nums">{depth}</span>
      </div>
      {lede && (
        <p className="mt-8 md:mt-12 max-w-[980px] text-[28px] md:text-[52px] leading-[1.04]" style={DISPLAY}>
          {lede}
        </p>
      )}
      {children && (
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-start-5 md:col-span-8 text-[15px] md:text-[17px] leading-[1.55] max-w-2xl space-y-4">{children}</div>
        </div>
      )}
    </motion.section>
  );
}

function Src({ n }: { n: number }) {
  return (
    <a href={`#src-${n}`} className="align-super text-[10px] text-black/45 hover:text-black ml-0.5">
      {n}
    </a>
  );
}

/** The soil hatches used on the screens, same convention as on engineering drawings. */
function Legend() {
  const t = useT();
  const items = [
    { id: 'remb', fr: 'Remblais', en: 'Fill' },
    { id: 'marn', fr: 'Marnes et caillasses', en: 'Marl and rubble' },
    { id: 'calc', fr: 'Calcaire grossier', en: 'Coarse limestone' },
    { id: 'argi', fr: 'Argile plastique', en: 'Plastic clay' },
    { id: 'void', fr: 'Vide', en: 'Void' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="l-remb" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#0a0a0a" /><circle cx="6" cy="6" r=".7" fill="#0a0a0a" opacity=".6" /></pattern>
          <pattern id="l-marn" width="16" height="10" patternUnits="userSpaceOnUse"><line x1="1" y1="3" x2="7" y2="3" stroke="#0a0a0a" /><line x1="9" y1="8" x2="15" y2="8" stroke="#0a0a0a" /></pattern>
          <pattern id="l-calc" width="18" height="9" patternUnits="userSpaceOnUse"><line x1="0" y1="8.5" x2="18" y2="8.5" stroke="#0a0a0a" strokeWidth=".8" /><line x1="4" y1="0" x2="4" y2="4.2" stroke="#0a0a0a" strokeWidth=".8" /><line x1="13" y1="4.5" x2="13" y2="8.5" stroke="#0a0a0a" strokeWidth=".8" /><line x1="0" y1="4.3" x2="18" y2="4.3" stroke="#0a0a0a" strokeWidth=".5" /></pattern>
          <pattern id="l-argi" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#0a0a0a" strokeWidth=".9" /></pattern>
          <pattern id="l-void" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#e3382a" strokeWidth="1.1" /></pattern>
        </defs>
      </svg>
      {items.map((it) => (
        <div key={it.id}>
          <svg viewBox="0 0 160 90" className="w-full h-auto block border border-black/80">
            <rect width="160" height="90" fill={`url(#l-${it.id})`} opacity={it.id === 'void' ? 1 : 0.55} />
          </svg>
          <div className="mt-2 text-[13px]">{t(it.fr, it.en)}</div>
        </div>
      ))}
    </div>
  );
}

export default function Colosse() {
  const t = useT();
  const np = nextProject('/colosse');

  const principles = [
    {
      k: t('Une coupe, pas des cases', 'A section, not boxes'),
      v: t(
        'Chaque information est à sa place réelle : l’immeuble au-dessus, le métro à côté, le vide devant. Le lien se voit au lieu de se déduire.',
        'Each piece of information sits where it really is: the building above, the metro next to it, the void ahead. You see the link instead of working it out.'
      ),
    },
    {
      k: t('Des cotes qui bougent', 'Dimensions that move'),
      v: t(
        'La distance au métro ou au vide est mesurée en continu, avec les flèches et les traits d’un vrai plan.',
        'The distance to the metro or to the void is measured continuously, with the arrows and ticks of a real drawing.'
      ),
    },
    {
      k: t('Le rouge, seulement pour décider', 'Red, only to decide'),
      v: t(
        'Au quotidien, l’écran reste en noir et gris. Le rouge n’apparaît que quand quelqu’un doit prendre une décision.',
        'Day to day, the screen stays black and grey. Red only appears when someone has to make a decision.'
      ),
    },
  ];

  const sources = [
    { n: 1, label: t('Défense-92 · « Le second tunnelier de la ligne 15 Ouest s’appelle Tiphaine »', 'Défense-92 · “The second TBM of line 15 West is called Tiphaine” (FR)'), href: 'https://www.defense-92.fr/?p=87222' },
    { n: 2, label: t('Ville de Fontenay-sous-Bois · Infos travaux ligne 15 (tunnelier Marine)', 'City of Fontenay-sous-Bois · Line 15 works leaflet (FR)'), href: 'https://www.fontenay.fr/fileadmin/medias/Pdf/Actu/INFOS_TRAVAUX_LIGNE15-DEPLIANT.pdf' },
    { n: 3, label: t('Ville de Paris · Inspection générale des carrières', 'City of Paris · Inspection générale des carrières (FR)'), href: 'https://www.paris.fr/pages/tout-savoir-sur-les-sous-sols-2317' },
    { n: 4, label: t('Inspection générale des carrières · Rapport annuel 2020', 'Inspection générale des carrières · 2020 annual report (FR)'), href: 'https://cdn.paris.fr/paris/2022/02/16/d84c53ed589571dd0da7d6c0da1c235a.pdf' },
    { n: 5, label: t('Société du Grand Paris · Charte et référentiels sécurité des chantiers', 'Société du Grand Paris · Site safety charter (FR)'), href: 'https://media-mediatheque.societedugrandparis.fr/pm_1_186_186873-yrrkxku2sd.pdf' },
  ];

  return (
    <main className="w-full min-h-screen bg-white text-[#0a0a0a] font-sans overflow-x-clip relative flex flex-col [scroll-snap-type:none]">
      <Header crumb="Colosse" />
      <Depth />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(10,10,10,.10)_1px,transparent_1.6px)] [background-size:20px_20px]" />
        <Cutter className="absolute right-[-38vw] md:right-[-14vw] top-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[78vw] md:h-[78vw]" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="absolute left-2 md:left-3 top-28 md:top-36 space-y-4">
          <h1 className="text-[19vw] md:text-[11vw] font-medium leading-[0.82] tracking-[-0.055em]">Colosse</h1>
          <h2 className="text-[13px] leading-[1.35] text-black/50"><span className="bg-white">{t('2026 — Concept UX/UI, poste de pilotage d’un tunnelier', '2026 — UX/UI concept, tunnel boring machine cockpit')}</span></h2>
        </motion.div>
        <div className="absolute left-2 md:left-3 bottom-12 text-[13px] text-black/45">{t('Descendre ↓', 'Go down ↓')}</div>
      </section>

      <div className="px-2 md:px-3 w-full max-w-[1400px] mx-auto">
        {/* LEDE + META */}
        <p className="pt-20 md:pt-28 max-w-[1050px] text-[30px] md:text-[60px] leading-[1.02]" style={DISPLAY}>
          {t(
            'Un tunnelier pèse plus de 1 600 tonnes et creuse sous Paris jour et nuit. J’ai imaginé l’écran de la personne qui le pilote.',
            'A tunnel boring machine weighs over 1,600 tonnes and digs under Paris day and night. I designed the screen of the person who drives it.'
          )}
        </p>
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 border-t border-black/15 pt-6">
          <dl className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6 content-start">
            {[
              [t('Année', 'Year'), '2026'],
              [t('Contexte', 'Context'), t('Projet personnel, concept', 'Personal project, concept')],
              [t('Rôle', 'Role'), t('Recherche, UX/UI, prototype codé', 'Research, UX/UI, coded prototype')],
              [t('Outils', 'Tools'), t('HTML, SVG et JS avec Claude', 'HTML, SVG and JS with Claude')],
            ].map(([k, v]) => (
              <div key={k} className="space-y-1">
                <dt className="text-[13px] text-black/45">{k}</dt>
                <dd className="text-[13px] leading-[1.35]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-8 space-y-5 text-[15px] md:text-[17px] leading-[1.55] max-w-2xl">
            <p>
              {t(
                'Les tunneliers du Grand Paris Express font une dizaine de mètres de diamètre, plus de cent mètres de long, et avancent d’une douzaine de mètres par jour. Chacun reçoit le prénom de sa marraine avant de partir.',
                'Grand Paris Express tunnel boring machines are about ten metres across, over a hundred metres long, and move forward about twelve metres a day. Each one is given its godmother’s first name before it starts.'
              )}
              <Src n={1} /><Src n={2} />
            </p>
            <p>
              {t(
                'Colosse est un concept : le poste de pilotage d’un tunnelier fictif, Ysée. Je ne suis jamais entré dans une cabine. Tout part de documents publics, et c’est justement la suite du projet.',
                'Colosse is a concept: the cockpit of a fictional machine, Ysée. I’ve never been inside a cab. Everything comes from public documents, and that’s exactly where the project goes next.'
              )}
            </p>
            <p>
              <a href="/colosse/prototype/index.html" className="underline underline-offset-2">
                {t('Ouvrir le prototype', 'Open the prototype')} →
              </a>
            </p>
          </div>
        </div>
        <figure className="mt-16 md:mt-24">
          <Media src="/colosse/2-anomalie.webp" alt={t('Anomalie : un vide devant la roue, sous une école', 'Anomaly: a void ahead of the wheel, under a school')} priority {...W} />
          <figcaption className="mt-3 max-w-3xl text-[13px] text-black/50">
            {t(
              '02:09. La sonde détecte un vide sous une école. L’écran le dessine à sa place dans le sol et propose trois options au pilote.',
              '02:09. The probe picks up a void under a school. The screen draws it where it is in the ground and gives the driver three options.'
            )}
          </figcaption>
        </figure>
      </div>

      {/* 01 — SCALE */}
      <div className="mt-24 md:mt-32 px-2 md:px-3">
        <Scale />
      </div>

      <div className="px-2 md:px-3 w-full max-w-[1400px] mx-auto">
        {/* 02 — PROBLEM */}
        <Chap
          n={2}
          title={t('Tout est lié', 'Everything is connected')}
          depth="−3,5 m"
          lede={t(
            'Sous terre, tout est lié : la pression devant la roue, le sol qui bouge sous un immeuble, l’anneau qu’on pose derrière.',
            'Underground, everything is connected: the pressure in front of the wheel, the ground moving under a building, the ring being built behind.'
          )}
        >
          <p>
            {t(
              'Le pilote surveille tout ça en même temps, pendant de longs postes, souvent la nuit. Mon hypothèse : si chaque valeur vit dans sa propre case, c’est à lui de faire tous les liens de tête.',
              'The driver watches all of this at once, over long shifts, often at night. My assumption: if every value lives in its own box, he has to make all the connections in his head.'
            )}
          </p>
          <p>{t('Je voulais un écran qui fasse ces liens avec lui.', 'I wanted a screen that makes those connections with him.')}</p>
        </Chap>

        {/* 03 — IDEA */}
        <Chap
          n={3}
          title={t('Un plan vivant', 'A living drawing')}
          depth="−8 m"
          lede={t('Les ingénieurs lisent déjà des coupes, des hachures et des cotes. Alors l’écran parle leur langue.', 'Engineers already read sections, hatches and dimensions. So the screen speaks their language.')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pb-16">
          {principles.map((p, i) => (
            <div key={p.k} className="border-t-[3px] border-[#0a0a0a] pt-3">
              <div className="text-[13px] text-black/45">0{i + 1}</div>
              <div className="mt-2 text-[22px] leading-[1.1]" style={DISPLAY}>{p.k}</div>
              <p className="mt-3 text-[15px] leading-[1.5] text-black/75">{p.v}</p>
            </div>
          ))}
        </div>
        <div className="pb-6">
          <div className="text-[13px] text-black/45 mb-4">{t('Les hachures, une par type de sol, comme sur les plans', 'Hatches, one per type of ground, as on engineering drawings')}</div>
          <Legend />
        </div>
        <div className="mt-16 md:mt-24 space-y-3">
          <Media src="/colosse/1-pilotage.webp" alt={t('Pilotage : la coupe du terrain en direct', 'Driving: the live section of the ground')} {...W} />
          <p className="text-[13px] text-black/50 max-w-3xl">
            {t(
              'En haut, la coupe : les immeubles, les couches de sol, la nappe, le métro existant à 3,4 m. La ligne noire, c’est maintenant. En bas, trois vues comme sur un plan : la roue de face (chaque trait est une molette, sa longueur montre l’usure), la rue vue du dessus, l’avancée de la nuit.',
              'At the top, the section: buildings, ground layers, groundwater, the existing metro 3.4 m away. The black line is now. Below, three views as on a drawing: the wheel from the front (each tick is a cutter, its length shows wear), the street from above, the night’s progress.'
            )}
          </p>
        </div>

        {/* 04 — 02:09 */}
        <section className="pt-32 md:pt-48">
          <div className="flex items-baseline justify-between border-t border-black/15 pt-3">
            <h3 className="text-[13px] text-black/45">04 → {t('Le moment critique', 'The critical moment')}</h3>
            <span className="text-[13px] tabular-nums">−14 m</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
            className="mt-6 text-[34vw] md:text-[24vw] leading-[0.8] tracking-[-0.06em] font-medium tabular-nums text-[#e3382a]"
          >
            02:09
          </motion.div>
          <p className="mt-8 md:mt-12 max-w-[980px] text-[28px] md:text-[52px] leading-[1.04]" style={DISPLAY}>
            {t('La sonde à l’avant de la roue détecte un vide, 31 mètres plus loin. Juste au-dessus, il y a une école.', 'The probe at the front of the wheel picks up a void, 31 metres ahead. Right above it, there’s a school.')}
          </p>
          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-start-5 md:col-span-8 text-[15px] md:text-[17px] leading-[1.55] max-w-2xl space-y-4">
              <p>
                {t(
                  'Ce n’est pas de la science-fiction : Paris a d’anciennes carrières de calcaire grossier sous plusieurs arrondissements, et la Ville a un service dédié pour les surveiller.',
                  'This isn’t science fiction: Paris has old coarse-limestone quarries under several districts, and the City has a dedicated service to monitor them.'
                )}
                <Src n={3} /><Src n={4} />
              </p>
              <p>
                {t(
                  'L’écran ne décide pas à la place de l’humain. Il propose trois options, avec ce que chacune ferait en surface : le tassement estimé sous l’école, en millimètres. L’ingénieur choisit, et son choix est enregistré avec ce qu’il savait à ce moment-là.',
                  'The screen doesn’t decide for the human. It offers three options, with what each would do at the surface: the estimated settlement under the school, in millimetres. The engineer chooses, and the choice is recorded with what was known at that moment.'
                )}
              </p>
            </div>
          </div>
        </section>
        <div className="mt-14 md:mt-20 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-6">
          <Zoom k="A" title={t('L’alerte.', 'The alert.')} src="/colosse/zoom-alerte.webp" w={2032} h={2096} alt={t('Gros plan : le vide dessiné dans le sol, à 31,6 m de la roue', 'Close-up: the void drawn in the ground, 31.6 m from the wheel')}>
            {t(
              'Le vide est dessiné là où il est, à 31,6 m de la roue et à 2,1 m du haut du tunnel. Au-dessus, le tassement estimé immeuble par immeuble, en rouge pour l’école.',
              'The void is drawn where it is, 31.6 m from the wheel and 2.1 m from the top of the tunnel. Above, the estimated settlement building by building, in red for the school.'
            )}
          </Zoom>
          <Zoom k="B" title={t('La décision.', 'The decision.')} src="/colosse/zoom-decision.webp" w={1448} h={1640} bare alt={t('Gros plan : les trois options proposées au pilote', 'Close-up: the three options offered to the driver')}>
            {t(
              'Trois options, chacune avec son effet sous l’école et son délai. Rien ne part sans un humain : il applique, ou il appelle la géotechnique.',
              'Three options, each with its effect under the school and its delay. Nothing happens without a human: he applies one, or calls the geotechnical team.'
            )}
          </Zoom>
        </div>

        {/* 05 — HANDOVER */}
        <Chap
          n={5}
          title={t('La relève', 'The handover')}
          depth="−17 m"
          lede={t('À 6 h, l’équipe du matin arrive. La nuit est dessinée le long du tunnel.', 'At 6 am, the morning crew arrives. The night is drawn along the tunnel.')}
        >
          <p>
            {t(
              'Au lieu d’une liste d’heures, chaque événement est épinglé à l’endroit où il s’est passé, sur les anneaux posés pendant la nuit. Ce qui change pour le poste suivant est barré et remplacé, et la relève se signe comme un plan, dans un cartouche.',
              'Instead of a list of times, each event is pinned where it happened, on the rings built during the night. What changes for the next shift is crossed out and replaced, and the handover is signed like a drawing, in a title block.'
            )}
          </p>
        </Chap>
        <Media src="/colosse/3-releve.webp" alt={t('Relève : la nuit dessinée le long du tunnel', 'Handover: the night drawn along the tunnel')} {...W} />
        <div className="mt-6 md:mt-8">
          <Zoom k="C" title={t('La relève.', 'The handover.')} src="/colosse/zoom-releve.webp" w={3864} h={944} alt={t('Gros plan : ce qui change pour le poste du matin, et le cartouche de relève', 'Close-up: what changes for the morning shift, and the handover title block')}>
            {t(
              'Ce qui change pour le poste du matin est barré puis remplacé : 12 m/jour devient 4 m/jour. La relève se signe dans un cartouche, comme un plan.',
              'What changes for the morning shift is crossed out and replaced: 12 m/day becomes 4 m/day. The handover is signed in a title block, like a drawing.'
            )}
          </Zoom>
        </div>

        {/* 06 — RINGS */}
        <Chap
          n={6}
          title={t('Les voussoirs', 'The segments')}
          depth="−19 m"
          lede={t('Derrière la roue, la machine construit le tunnel elle-même, anneau par anneau.', 'Behind the wheel, the machine builds the tunnel itself, ring by ring.')}
        >
          <p>
            {t(
              'Chaque anneau est fait de pièces de béton posées par un bras, l’érecteur. L’écran montre l’anneau de face : les pièces posées sont hachurées, celle en cours est tracée en gras, les suivantes en pointillés. À droite, les tolérances à tenir.',
              'Each ring is made of concrete segments placed by an arm, the erector. The screen shows the ring from the front: placed segments are hatched, the current one is drawn in bold, the next ones dotted. On the right, the tolerances to hold.'
            )}
          </p>
        </Chap>
        <Media src="/colosse/4-voussoirs.webp" alt={t('Voussoirs : l’anneau en construction', 'Segments: the ring being built')} {...W} />

        {/* 07 — HYPERBARIC */}
        <Chap
          n={7}
          title={t('Sous pression', 'Under pressure')}
          depth="−21 m"
          lede={t('Pour changer une molette usée, des techniciens entrent dans la chambre, devant la roue, sous pression.', 'To change a worn cutter, technicians go into the chamber in front of the wheel, under pressure.')}
        >
          <p>
            {t(
              'Ces interventions sont encadrées par la charte de sécurité des chantiers du Grand Paris Express. Après le travail, il faut ressortir par paliers. L’écran suit l’équipe, le temps passé sous pression et l’heure de sortie à ne pas dépasser, avec un bouton pour la rappeler.',
              'These interventions are covered by the Grand Paris Express site safety charter. After the work, the crew has to come out in stages. The screen follows the team, the time spent under pressure and the latest exit time, with a button to call them back.'
            )}
            <Src n={5} />
          </p>
        </Chap>
        <Media src="/colosse/5-hyperbare.webp" alt={t('Intervention sous pression', 'Intervention under pressure')} {...W} />

        {/* 08 — NIGHT MODE */}
        <Chap
          n={8}
          title={t('Le mode cabine', 'Cab mode')}
          depth="−22 m"
          lede={t('La nuit, dans une cabine, un écran blanc éblouit. Chaque écran existe aussi en sombre.', 'At night, in a cab, a white screen dazzles. Every screen also exists in dark.')}
        >
          <p>
            {t(
              'Mêmes repères, mêmes hachures. Seule la ligne du présent passe en jaune-vert, pour rester visible du coin de l’œil.',
              'Same landmarks, same hatches. Only the line of the present turns yellow-green, so it stays visible out of the corner of the eye.'
            )}
          </p>
        </Chap>
        <Compare
          pairs={[
            { name: t('Pilotage', 'Driving'), day: '/colosse/1-pilotage.webp', night: '/colosse/1-pilotage-nuit.webp', alt: t('Pilotage', 'Driving') },
            { name: t('Anomalie', 'Anomaly'), day: '/colosse/2-anomalie.webp', night: '/colosse/2-anomalie-nuit.webp', alt: t('Anomalie', 'Anomaly') },
          ]}
        />

        {/* 09 — PROTOTYPE */}
        <Chap n={9} title={t('Le prototype', 'The prototype')} depth="−22 m" lede={t('Fais avancer la machine, choisis quoi faire face au vide, puis passe la main à l’équipe du matin.', 'Move the machine forward, choose what to do about the void, then hand over to the morning crew.')} />
        <div className="md:hidden border border-black/15">
          <Media video src="/colosse/colosse-prototype-v2.mp4" width={1622} height={1208} alt={t('Vidéo du prototype : la machine détecte le vide, le pilote choisit l’option A, puis la relève de 6 h est signée', 'Prototype video: the machine detects the void, the driver picks option A, then the 6 am handover is signed')} />
        </div>
        <div className="hidden md:block w-full aspect-[16/10] border border-black/15">
          <iframe src="/colosse/prototype/index.html" title={t('Prototype Colosse', 'Colosse prototype')} className="w-full h-full" loading="lazy" />
        </div>
        <p className="mt-4 text-[13px]">
          <a href="/colosse/prototype/index.html" className="underline underline-offset-2">
            {t('Ouvrir le prototype en plein écran', 'Open the prototype full screen')} →
          </a>
          <span className="text-black/45 md:hidden"> {t('(à essayer sur ordinateur)', '(try it on a computer)')}</span>
        </p>

        {/* 10 — WHAT'S LEFT */}
        <Chap
          n={10}
          title={t('Ce qu’il reste à prouver', 'What’s left to prove')}
          depth={t('Arrivée', 'Arrived')}
          lede={t('Je n’ai encore montré ces écrans à aucun pilote de tunnelier.', 'I haven’t shown these screens to a single TBM driver yet.')}
        >
          <p>
            {t(
              'Les chiffres d’échelle et le contexte viennent de documents publics. Le reste, les écrans, les seuils et l’histoire de la nuit, ce sont mes hypothèses.',
              'The scale figures and the context come from public documents. The rest, the screens, the thresholds and the story of the night, are my assumptions.'
            )}
          </p>
          <p>
            {t(
              'La suite : montrer le prototype à des gens qui travaillent sur ces chantiers et corriger tout ce qui sonne faux. Si c’est ton métier, écris-moi.',
              'Next: show the prototype to people who work on these sites and fix everything that rings false. If this is your job, write to me.'
            )}
          </p>
        </Chap>

        {/* SOURCES */}
        <section className="pb-6">
          <div className="text-[13px] text-black/45 border-t border-black/15 pt-3 mb-4">{t('Sources', 'Sources')}</div>
          <ol className="space-y-2 text-[13px]">
            {sources.map((s) => (
              <li key={s.n} id={`src-${s.n}`} className="flex gap-3">
                <span className="text-black/45 w-4">{s.n}</span>
                <a href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-black/60">
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* NEXT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 border-t-[3px] border-[#0a0a0a] pt-2 flex flex-col items-start gap-6"
        >
          <span className="text-[13px] text-black/45">{t('Projet suivant', 'Next project')}</span>
          <Link href={np.link} className="group">
            <span className="text-[9vw] md:text-[5vw] font-medium leading-[0.95] tracking-[-0.04em] group-hover:opacity-50 transition">{t(np.title.fr, np.title.en)} →</span>
          </Link>
        </motion.div>
        <footer className="mt-24 mb-12 text-[13px] text-black/40">© {new Date().getFullYear()} Emmanuel</footer>
      </div>
    </main>
  );
}
