'use client';

import Image from 'next/image';
import { ProjectPage, Media, Chapter, Summary } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';
import styles from './elan.module.css';

type T = <V,>(fr: V, en: V) => V;

const problems = (t: T) => [
  {
    when: t('Avant', 'Before'),
    title: t('Programmer une séance', 'Setting up a session'),
    text: t(
      'Sur la montre, créer une séance d’intervalles demande de traverser plusieurs écrans de réglages.',
      'On the watch, building an interval session means going through several settings screens.'
    ),
  },
  {
    when: t('Pendant', 'During'),
    title: t('Lire en courant', 'Reading while running'),
    text: t(
      'Les écrans de données affichent plusieurs champs de même importance. Le coup d’œil devient une lecture.',
      'Data screens show several fields of equal weight. A glance turns into reading.'
    ),
  },
  {
    when: t('Après', 'After'),
    title: t('Savoir si c’était réussi', 'Knowing if it went well'),
    text: t(
      'Le résumé liste les tours et les moyennes. La réponse à « ai-je tenu ma séance ? » reste à déduire.',
      'The summary lists laps and averages. The answer to “did I hold my session?” is left to work out.'
    ),
  },
];

const moments = (t: T) => [
  {
    where: t('Avant · iPhone', 'Before · iPhone'),
    title: t('Repartir de la dernière séance', 'Start from the last session'),
    text: t(
      'La séance précédente est déjà là. On l’ajuste d’un geste, une répétition de plus ou cinq secondes plus vite, puis on l’envoie à la montre.',
      'The previous session is already there. Adjust it in one tap, one more rep or five seconds faster, then send it to the watch.'
    ),
  },
  {
    where: t('Pendant · montre', 'During · watch'),
    title: t('Une information à la fois', 'One piece of information at a time'),
    text: t(
      'Chaque écran répond à une seule question. La teinte du verre donne l’état avant même la lecture.',
      'Each screen answers a single question. The tint of the glass gives the state before you even read.'
    ),
  },
  {
    where: t('Après · iPhone', 'After · iPhone'),
    title: t('Un verdict', 'A verdict'),
    text: t(
      'Sept répétitions sur huit dans la cible. Le détail vient ensuite, pour qui le veut.',
      'Seven reps out of eight on target. The detail comes after, for those who want it.'
    ),
  },
];

const glance = (t: T) => [
  {
    time: t('0,2 s', '0.2 s'),
    title: t('La teinte', 'The tint'),
    text: t(
      'Vu du coin de l’œil : effort, récupération ou hors cible.',
      'Seen from the corner of the eye: effort, recovery or off target.'
    ),
  },
  {
    time: t('0,5 s', '0.5 s'),
    title: t('Le mot', 'The word'),
    text: t(
      'Effort, Récup, Trop vite. Toujours au même endroit, il confirme la teinte.',
      'Effort, Recovery, Too fast. Always in the same place, it confirms the tint.'
    ),
  },
  {
    time: t('1 s', '1 s'),
    title: t('Le chiffre', 'The number'),
    text: t(
      'Un seul chiffre, le plus grand possible : ce qu’il reste à faire.',
      'A single number, as large as possible: what is left to do.'
    ),
  },
];

const layers = (t: T) => [
  { n: '04', title: t('Le chiffre', 'The number'), text: t('Ce qu’il reste à faire.', 'What is left to do.') },
  { n: '03', title: t('L’anneau de points', 'The ring of dots'), text: t('L’avancement dans la répétition.', 'Progress through the rep.') },
  { n: '02', title: t('La trame', 'The dot field'), text: t('L’intensité : elle monte avec l’effort.', 'Intensity: it rises with effort.') },
  { n: '01', title: t('Le verre teinté', 'The tinted glass'), text: t('L’état : effort, récupération, hors cible.', 'The state: effort, recovery, off target.') },
];

const rules = (t: T) => [
  {
    title: t('Une valeur domine', 'One value leads'),
    text: t('La distance restante en effort, le temps restant en récupération.', 'Distance left during effort, time left during recovery.'),
  },
  {
    title: t('Hors cible, le mot dit quoi faire', 'Off target, the word says what to do'),
    text: t('« Ralentis », « Accélère » : une consigne plutôt qu’un constat.', '“Slow down”, “Speed up”: an instruction rather than a reading.'),
  },
  {
    title: t('La récupération se règle', 'Recovery is adjustable'),
    text: t('Quinze secondes de plus ou repartir tout de suite, d’un bouton.', 'Fifteen more seconds or go again right away, with one button.'),
  },
  {
    title: t('Sans GPS, pas de fausse allure', 'No GPS, no false pace'),
    text: t('L’écran bascule sur le temps écoulé, et le dit.', 'The screen switches to elapsed time, and says so.'),
  },
];

const screens = (t: T) => [
  { f: '01-jour', name: t('Séance du jour', 'Today’s session') },
  { f: '02-pret', name: t('Prêt', 'Ready') },
  { f: '03-echauf', name: t('Échauffement', 'Warm-up') },
  { f: '04-effort', name: t('Effort', 'Effort') },
  { f: '05-vite', name: t('Trop vite', 'Too fast') },
  { f: '06-lent', name: t('Trop lent', 'Too slow') },
  { f: '07-fin', name: t('Fin d’effort', 'End of effort') },
  { f: '08-chrecup', name: t('Changement : récup', 'Switch: recovery') },
  { f: '09-recup', name: t('Récupération', 'Recovery') },
  { f: '10-finrecup', name: t('Fin de récup', 'End of recovery') },
  { f: '11-go', name: t('Changement : effort', 'Switch: effort') },
  { f: '12-derniere', name: t('Dernière répétition', 'Last rep') },
  { f: '13-pause', name: t('Pause', 'Pause') },
  { f: '14-gps', name: t('GPS faible', 'Weak GPS') },
  { f: '15-calme', name: t('Retour au calme', 'Cool-down') },
  { f: '16-resume', name: t('Résumé', 'Summary') },
  { f: '17-coeur', name: t('Option : récup au cœur', 'Option: heart-rate recovery') },
];

const drawings = (t: T) => [
  {
    key: 'empreinte',
    where: t('Résumé · iPhone', 'Summary · iPhone'),
    title: t('L’empreinte de la séance', 'The session’s fingerprint'),
    text: t(
      'Un anneau par tour, huit en tout. Plus le point est gros, plus l’allure était rapide. On voit tout de suite que le premier tour est parti trop vite.',
      'One ring per lap, eight in all. The bigger the dot, the faster the pace. You can see right away that the first lap started too fast.'
    ),
  },
  {
    key: 'coeur',
    where: t('Option · montre', 'Option · watch'),
    title: t('La récupération au cœur', 'Recovery by heart rate'),
    text: t(
      'Le cœur se vide quand le pouls redescend. Quand il est vide, on repart : la récupération dépend du coureur, pas du chronomètre.',
      'The heart empties as the pulse comes down. When it is empty, you go again: recovery depends on the runner, not on the stopwatch.'
    ),
  },
  {
    key: 'foulee',
    where: t('Résumé · iPhone', 'Summary · iPhone'),
    title: t('La foulée', 'The stride'),
    text: t(
      'L’écart entre deux appuis, déduit de l’allure et de la cadence. Il raccourcit quand la fatigue arrive.',
      'The gap between two footfalls, derived from pace and cadence. It shortens as fatigue sets in.'
    ),
  },
  {
    key: 'ondes',
    where: t('Pendant · montre', 'During · watch'),
    title: t('Les vibrations', 'The vibrations'),
    text: t(
      'Chaque signal a sa forme : trois ondes serrées, une onde large, deux ondes décalées.',
      'Each signal has its own shape: three tight waves, one wide wave, two offset waves.'
    ),
  },
];

const phoneScreens = (t: T) => [
  { f: 'accueil', h: 1688, name: t('Accueil', 'Home') },
  { f: 'creer', h: 1688, name: t('Ajuster la séance', 'Adjust the session') },
  { f: 'envoyee', h: 1688, name: t('Sur la montre', 'On the watch') },
  { f: 'progression', h: 1688, name: t('Progression', 'Progress') },
  { f: 'resume', h: 3120, name: t('Résumé, écran complet', 'Summary, full screen') },
];

/** Partition des vibrations sur une répétition, puis sa récupération. */
function HapticScore({ t }: { t: T }) {
  const y = 92;
  const dotsLine = Array.from({ length: 95 }, (_, i) => 30 + i * 10);
  const short = (x: number, n: number, hollow = false) =>
    Array.from({ length: n }, (_, i) => (
      <circle key={`${x}-${i}`} cx={x + i * 16} cy={y - 30} r={6} fill={hollow ? 'none' : '#0a0a0a'} stroke="#0a0a0a" strokeWidth={1.5} />
    ));
  const long = (x: number) => <rect x={x - 17} y={y - 37} width={34} height={14} rx={7} fill="#0a0a0a" />;
  const label = (x: number, a: string, b: string, anchor: 'start' | 'middle' | 'end' = 'middle') => (
    <>
      <text x={x} y={y + 34} textAnchor={anchor} fontSize={15} fontWeight={500} fill="#0a0a0a">{a}</text>
      <text x={x} y={y + 55} textAnchor={anchor} fontSize={13} fill="#0a0a0a" fillOpacity={0.5}>{b}</text>
    </>
  );
  return (
    <svg
      viewBox="0 0 1000 200"
      className="w-full h-auto min-w-[640px]"
      role="img"
      aria-label={t('Partition des vibrations : une longue au départ, deux rapides hors cible, trois courtes avant chaque changement.', 'Vibration score: one long at the start, two quick ones off target, three short ones before each change.')}
    >
      {dotsLine.map((x) => (
        <circle key={x} cx={x} cy={y} r={1.6} fill="#0a0a0a" fillOpacity={0.4} />
      ))}
      {long(40)}
      {label(30, 'Go', t('1 longue', '1 long'), 'start')}
      {short(232, 2, true)}
      {label(240, t('Hors cible', 'Off target'), t('2 rapides, si besoin', '2 quick, if needed'))}
      {short(504, 3)}
      {label(520, t('50 m avant', '50 m before'), t('3 courtes', '3 short'))}
      {long(620)}
      {label(620, t('Récup', 'Recovery'), t('1 longue', '1 long'))}
      {short(864, 3)}
      {label(880, t('5 s avant', '5 s before'), t('3 courtes', '3 short'))}
      {long(960)}
      {label(970, 'Go', t('1 longue', '1 long'), 'end')}
      <line x1={30} y1={y + 74} x2={612} y2={y + 74} stroke="#0a0a0a" strokeWidth={2} />
      <line x1={628} y1={y + 74} x2={970} y2={y + 74} stroke="#0a0a0a" strokeOpacity={0.35} strokeWidth={2} />
      <text x={30} y={y + 96} fontSize={13} fill="#0a0a0a" fillOpacity={0.5}>{t('Effort · 400 m', 'Effort · 400 m')}</text>
      <text x={628} y={y + 96} fontSize={13} fill="#0a0a0a" fillOpacity={0.5}>{t('Récupération · 1:00', 'Recovery · 1:00')}</text>
    </svg>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="block text-[13px] text-black/45">{children}</span>;
}

export default function Page() {
  const t = useT();

  return (
    <ProjectPage
      title="Élan"
      subtitle={t(
        'Une appli de fractionné qu’on lit d’un coup d’œil. Concept pour montre et iPhone.',
        'An interval-training app you read at a glance. A concept for watch and iPhone.'
      )}
      meta={{
        year: '2026',
        context: t('Projet personnel, concept', 'Personal project, concept'),
        role: t('Recherche, concept, UX/UI, direction artistique, 3D', 'Research, concept, UX/UI, art direction, 3D'),
        tools: 'Figma, Blender, Claude',
      }}
      hero={
        <div className="space-y-8 md:space-y-10">
          <Media
          src="/elan/hero.jpg"
          alt={t(
            'Rendu 3D de la montre : écran d’effort, 320 mètres restants, allure 4:02 au kilomètre',
            '3D render of the watch: effort screen, 320 metres left, pace 4:02 per kilometre'
          )}
          width={2000}
          height={1250}
          priority
        />
          <Summary
            items={[
              { k: t('Le problème', 'The problem'), v: t('Pour les coureurs qui font du fractionné seuls : en plein effort, un coup d’œil dure une seconde, et les montres affichent tout à la fois.', 'For runners who do intervals on their own: mid-effort, a glance lasts a second, and watches show everything at once.') },
              { k: t('Ce que j’ai conçu', 'What I designed'), v: t('Une appli montre et iPhone : préparer la séance d’un geste, une seule information par écran en courant, un verdict à la fin.', 'A watch and iPhone app: set up the session in one gesture, one piece of information per screen while running, a verdict at the end.') },
              { k: t('Le parti pris', 'The stance'), v: t('Une lecture en trois temps, la teinte, le mot, le chiffre : on sait où on en est avant même de lire.', 'A three-step read, tint, word, figure: you know where you are before you even read.') },
            ]}
          />
        </div>
      }
      intro={t(
        <>
          <p className="text-black/60">Projet personnel. Un premier échange avec un coureur a orienté les choix ; le test sur piste est la prochaine étape.</p>
        </>,
        <>
          <p className="text-black/60">Personal project. A first conversation with a runner shaped the choices; the track test is the next step.</p>
        </>
      )}
    >


      {/* PROBLEM */}
      <Chapter n={1} title={t('Le problème', 'The problem')} lede={t('Trois questions, une seconde pour y répondre.', 'Three questions, one second to answer them.')}>
        <p>
          {t('En fractionné, on se pose trois questions : où j’en suis, suis-je à la bonne allure, quand ça change. Les montres de sport, elles, affichent tout en même temps.', 'In interval training you ask three questions: where am I, am I on pace, when does it change. Sports watches show everything at once.')}
        </p>
        <p>
          {t('J’ai comparé Garmin, Apple Watch, Runna et Strava. Un premier échange avec un coureur qui pratique le fractionné a confirmé l’essentiel : en courant, il ne regarde que la distance restante et l’allure.', 'I compared Garmin, Apple Watch, Runna and Strava. A first conversation with a runner who does intervals confirmed the essentials: while running, he only looks at distance left and pace.')}
        </p>
      </Chapter>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {problems(t).map((p) => (
          <li key={p.title} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <span className="text-[13px] text-black/45">{p.when}</span>
            <h4 className="font-medium">{p.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{p.text}</p>
          </li>
        ))}
      </ol>

      {/* CONCEPT */}
      <Chapter n={2} title={t('Le concept', 'The concept')} lede={t('Le téléphone prépare et relit, la montre ne garde que ce qui se lit en courant.', 'The phone prepares and reviews, the watch keeps only what can be read while running.')}>
        <p>
          {t(
            'Le téléphone sert à préparer la séance et à la relire. La montre ne garde que ce qui se lit en courant.',
            'The phone is for setting up the session and reviewing it. The watch keeps only what can be read while running.'
          )}
        </p>
      </Chapter>
      <Media
        src="/elan/duo.jpg"
        alt={t(
          'Rendu 3D : le téléphone affiche l’accueil, la montre la séance du jour',
          '3D render: the phone shows the home screen, the watch shows today’s session'
        )}
        width={1700}
        height={1275}
      />
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {moments(t).map((m, i) => (
          <li key={m.title} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <span className="text-[13px] text-black/45">
              0{i + 1} — {m.where}
            </span>
            <h4 className="font-medium">{m.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{m.text}</p>
          </li>
        ))}
      </ol>

      {/* PRINCIPLE */}
      <Chapter n={3} title={t('Le principe', 'The principle')} lede={t('Une lecture en trois temps : la teinte, le mot, le chiffre.', 'A three-step read: tint, word, figure.')}>
        <p>
          {t('En une seconde, on lit une partie d’écran, toujours dans le même ordre. La montre est conçue pour cette lecture en trois temps.', 'In one second you read part of a screen, always in the same order. The watch is built for that three-step reading.')}
        </p>
      </Chapter>
      <div className="space-y-3">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
          {glance(t).map((g) => (
            <li key={g.title} className="bg-white p-6 md:p-8 flex flex-col gap-3">
              <span className="text-[8vw] md:text-[1.5vw] font-medium leading-[0.95] tracking-[-0.04em]">{g.time}</span>
              <h4 className="pt-3 font-medium">{g.title}</h4>
              <p className="text-sm text-black/60 leading-relaxed">{g.text}</p>
            </li>
          ))}
        </ol>
        <Caption>
          {t(
            'Durées cibles, fixées comme objectif de conception.',
            'Target durations, set as a design goal.'
          )}
        </Caption>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-black/15 border border-black/15">
        <div className="md:col-span-7 bg-[#0c0d0f]">
          <video
            className="w-full h-auto block"
            poster="/elan/explode.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={t(
              'Vue éclatée en 3D de l’écran : boîtier et verre teinté, trame de points, anneau de progression, chiffres, verre de protection',
              'Exploded 3D view of the screen: case and tinted glass, dot field, progress ring, numbers, cover glass'
            )}
          >
            <source src="/elan/explode.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="md:col-span-5 bg-white p-6 md:p-8 flex flex-col justify-between gap-10">
          <div className="space-y-4">
            <span className="text-[13px] text-black/45">{t('Vue éclatée', 'Exploded view')}</span>
            <h4 className="font-medium">
              {t('Un écran, quatre couches, une information par couche.', 'One screen, four layers, one piece of information per layer.')}
            </h4>
          </div>
          <ol className="divide-y divide-black/15 border-t border-black/15">
            {layers(t).map((l) => (
              <li key={l.n} className="grid grid-cols-[3rem_1fr] gap-2 py-4">
                <span className="text-[13px] text-black/45 pt-0.5">{l.n}</span>
                <div className="space-y-1">
                  <h5 className="font-medium">{l.title}</h5>
                  <p className="text-sm text-black/60 leading-relaxed">{l.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* WATCH */}
      <Chapter n={4} title={t('La montre', 'The watch')} lede={t('Un écran, une question.', 'One screen, one question.')}>
        <p>
          {t('La teinte du verre change, jamais la mise en page : bleuté en récupération, neutre en effort, rosé hors cible.', 'The glass tint changes, never the layout: bluish in recovery, neutral in effort, pink off target.')}
        </p>
        <p>
          {t(
            'La couleur n’est jamais seule à porter l’information, le mot la répète toujours.',
            'Colour is never the only carrier of the information, the word always repeats it.'
          )}
        </p>
      </Chapter>
      <Media
        src="/elan/trio.jpg"
        alt={t(
          'Rendu 3D de trois montres : récupération, effort, trop vite',
          '3D render of three watches: recovery, effort, too fast'
        )}
        width={1700}
        height={956}
      />
      <Media
        src="/elan/macro.jpg"
        alt={t(
          'Gros plan 3D : le chiffre domine, la trame de points dessine la vitesse en bas de l’écran',
          '3D close-up: the number dominates, the dot field draws the pace at the bottom of the screen'
        )}
        width={1700}
        height={1062}
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-black/15 border border-black/15">
        <div className="md:col-span-5 bg-[#f1f1ef] p-10 md:p-14 flex items-center justify-center">
          <div
            className={styles.live}
            role="img"
            aria-label={t(
              'Écran de montre qui passe de l’effort au hors cible, puis à la récupération',
              'Watch screen moving from effort to off target, then to recovery'
            )}
          >
            {['effort', 'vite', 'recup'].map((k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={k} src={`/elan/w/live-${k}.webp`} alt="" width={760} height={760} loading="lazy" />
            ))}
          </div>
        </div>
        <ol className="md:col-span-7 bg-white px-6 md:px-8 divide-y divide-black/15">
          {rules(t).map((r, i) => (
            <li key={r.title} className="grid grid-cols-[3rem_1fr] gap-2 py-5 md:py-6">
              <span className="text-[13px] text-black/45 pt-1">0{i + 1}</span>
              <div className="space-y-1.5">
                <h4 className="font-medium">{r.title}</h4>
                <p className="text-sm text-black/60 leading-relaxed">{r.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-3">
        <ol className="grid grid-cols-3 md:grid-cols-6 gap-px bg-black/15 border border-black/15">
          {screens(t).map((s, i) => (
            <li key={s.f} className="bg-white p-3 md:p-5 flex flex-col gap-3">
              <Image
                src={`/elan/w/${s.f}.webp`}
                alt={t(`Écran de montre : ${s.name}`, `Watch screen: ${s.name}`)}
                width={440}
                height={440}
                sizes="(max-width: 768px) 33vw, 220px"
                className="w-full h-auto block"
              />
              <span className="text-[12px] md:text-[13px] leading-snug">
                <span className="text-black/45">{String(i + 1).padStart(2, '0')}</span> {s.name}
              </span>
            </li>
          ))}
          <li className="bg-white p-3 md:p-5 flex items-end">
            <p className="text-[12px] md:text-[13px] text-black/45 leading-snug">
              {t('Un écran, une question.', 'One screen, one question.')}
            </p>
          </li>
        </ol>
        <Caption>{t('Une séance complète : seize écrans et une option.', 'A full session: sixteen screens and one option.')}</Caption>
      </div>

      <Media video src="/motion/elan-interval.mp4" width={1920} height={1080} alt={t('Animation : trois montres passent d’un écran de séance au suivant, décalées', 'Animation: three watches move from one session screen to the next, out of step')} />

      {/* HAPTICS */}
      <Media
        src="/elan/night.jpg"
        alt={t(
          'Rendu 3D de nuit : l’écran passe au rosé quand l’allure est trop rapide, le mot « Trop vite » le dit aussi',
          '3D night render: the screen turns rose when the pace is too fast, and the words “Trop vite” say it too'
        )}
        width={1700}
        height={1062}
      />
      <Chapter title={t('Sans regarder', 'Without looking')}>
        <p>
          {t(
            'La montre vibre avant que l’écran change. Trois signaux : ça va changer, ça change, on sort de la cible.',
            'The watch vibrates before the screen changes. Three signals: it is about to change, it changes, you are off target.'
          )}
        </p>
      </Chapter>
      <div className="border border-black/15 p-5 md:p-10 overflow-x-auto">
        <HapticScore t={t} />
      </div>

      {/* DRAWN DATA */}
      <Chapter n={5} title={t('Les données en points', 'Data in dots')} lede={t('On reconnaît la forme avant de lire le chiffre.', 'You recognise the shape before reading the figure.')}>
        <p>
          {t(
            'Du blanc, du verre fumé et des points. Chaque illustration représente une mesure, donc on reconnaît la forme avant de lire le chiffre.',
            'White, smoked glass and dots. Each illustration stands for a measurement, so you recognise the shape before you read the number.'
          )}
        </p>
      </Chapter>
      <div className="space-y-3">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/15 border border-black/15">
          {drawings(t).map((d) => (
            <li key={d.key} className="bg-white flex flex-col">
              <div className={`${styles.smoke} relative aspect-[4/3]`}>
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-14">
                {d.key === 'ondes' ? (
                  <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-[520px] text-center text-white text-[12px] md:text-[13px]">
                    {[
                      ['court', t('ça va changer', 'about to change')],
                      ['long', t('ça change', 'it changes')],
                      ['rapide', t('hors cible', 'off target')],
                    ].map(([k, label]) => (
                      <div key={k} className="space-y-2">
                        <Image src={`/elan/d/onde-${k}.svg`} alt="" width={150} height={150} unoptimized className="w-full h-auto" />
                        <span className="block">{label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Image
                    src={`/elan/d/${d.key}.svg`}
                    alt={d.title}
                    width={d.key === 'empreinte' ? 340 : d.key === 'coeur' ? 260 : 460}
                    height={d.key === 'empreinte' ? 220 : d.key === 'coeur' ? 240 : 500}
                    unoptimized
                    className={d.key === 'empreinte' ? 'w-[82%] h-auto' : d.key === 'coeur' ? 'w-[44%] h-auto' : 'max-h-full w-auto'}
                  />
                )}
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-3">
                <span className="text-[13px] text-black/45">{d.where}</span>
                <h4 className="font-medium">{d.title}</h4>
                <p className="text-sm text-black/60 leading-relaxed max-w-md">{d.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* PHONE */}
      <Chapter n={6} title={t('Le téléphone', 'The phone')} lede={t('Un verdict d’abord, le détail ensuite.', 'A verdict first, the detail after.')}>
        <p>
          {t(
            'La séance s’écrit comme une phrase : huit fois 400 mètres à 4:00, une minute de récupération. On touche une valeur pour la modifier.',
            'The session is written as a sentence: eight times 400 metres at 4:00, one minute of recovery. You tap a value to change it.'
          )}
        </p>
        <p>
          {t(
            'Après la course, le verdict d’abord, puis chaque répétition avec son écart à la cible, et l’empreinte de la séance.',
            'After the run, the verdict first, then each rep with its gap to target, and the session’s fingerprint.'
          )}
        </p>
      </Chapter>
      <Media
        src="/elan/phones.jpg"
        alt={t(
          'Rendu 3D de trois téléphones : accueil, réglage de la séance, résumé',
          '3D render of three phones: home, session set-up, summary'
        )}
        width={1700}
        height={1062}
      />
      <ol className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-start">
        {phoneScreens(t).map((p) => (
          <li key={p.f} className="space-y-2">
            <Image
              src={`/elan/p/${p.f}.webp`}
              alt={t(`Écran iPhone : ${p.name}`, `iPhone screen: ${p.name}`)}
              width={780}
              height={p.h}
              sizes="(max-width: 768px) 50vw, 260px"
              className="w-full h-auto block border border-black/10"
            />
            <Caption>{p.name}</Caption>
          </li>
        ))}
      </ol>

      {/* NEXT */}
      <Chapter n={7} title={t('La suite', 'What’s next')}>
        <p>
          {t('Prochaine étape : un test de lisibilité en mouvement pour fixer la taille des chiffres, puis le prototype sur piste avec des coureurs.', 'Next step: a legibility test in motion to set the figure size, then the prototype on the track with runners.')}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
