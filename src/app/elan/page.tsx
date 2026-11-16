'use client';

import Image from 'next/image';
import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';
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
      'Du coin de l’œil, sans faire le point : effort, récupération ou hors cible.',
      'From the corner of the eye, without focusing: effort, recovery or off target.'
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
      'Une seule valeur, la plus grande possible : ce qu’il reste à faire.',
      'A single value, as large as possible: what is left to do.'
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
      'Huit tours, huit anneaux. Plus le point est gros, plus l’allure était rapide : le départ trop vif du premier tour se voit d’un regard.',
      'Eight laps, eight rings. The bigger the dot, the faster the pace: the over-eager start of the first lap shows at a glance.'
    ),
  },
  {
    key: 'coeur',
    where: t('Option · montre', 'Option · watch'),
    title: t('La récupération au cœur', 'Recovery by heart rate'),
    text: t(
      'Le cœur se vide à mesure que le pouls redescend. Vide, on repart : la récupération s’adapte au coureur plutôt qu’au chronomètre.',
      'The heart empties as the pulse comes down. Empty, you go again: recovery adapts to the runner rather than the stopwatch.'
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
      'Trois ondes serrées, une onde large, deux ondes décalées : chaque signal a sa forme.',
      'Three tight waves, one wide wave, two offset waves: each signal has its own shape.'
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
      aria-label={t(
        'Partition des vibrations : une longue au départ, deux rapides si hors cible, trois courtes 50 mètres avant la fin, une longue au changement, trois courtes 5 secondes avant la reprise, une longue au départ suivant.',
        'Vibration score: one long at the start, two quick if off target, three short 50 metres before the end, one long at the switch, three short 5 seconds before restarting, one long at the next start.'
      )}
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
        'Le fractionné qui se lit en une seconde. Concept pour montre connectée et iPhone.',
        'Interval training, readable in one second. A concept for smartwatch and iPhone.'
      )}
      meta={{
        year: '2026',
        context: t('Projet personnel, concept', 'Personal project, concept'),
        role: t('Recherche, concept, UX/UI, direction artistique, 3D', 'Research, concept, UX/UI, art direction, 3D'),
        tools: 'Figma, Blender, Claude',
      }}
      intro={t(
        <>
          <p>
            Élan est un concept d&apos;application de course pour les séances de fractionné : celles où
            l&apos;on alterne des efforts courts et des récupérations, montre au poignet, souvent seul.
          </p>
          <p>
            Le point de départ est une contrainte : en plein effort, un coup d&apos;œil à la montre dure
            une à deux secondes. Tout le projet cherche à faire tenir l&apos;essentiel dans ce coup
            d&apos;œil, puis à simplifier ce qui se passe avant et après, sur le téléphone.
          </p>
          <p>
            Le concept couvre le parcours complet : la préparation de la séance sur iPhone, seize
            états de montre pendant la course, et le résumé. La prochaine étape est le test sur
            piste, avec des coureurs.
          </p>
        </>,
        <>
          <p>
            Élan is a concept for a running app built around interval sessions: the ones where you
            alternate short efforts and recoveries, watch on your wrist, often alone.
          </p>
          <p>
            It starts from a constraint: mid-effort, a glance at the watch lasts one to two seconds.
            The whole project tries to fit what matters into that glance, then to simplify what
            happens before and after, on the phone.
          </p>
          <p>
            The concept covers the full journey: setting up the session on iPhone, sixteen watch
            states during the run, and the summary. The next step is testing on the track, with
            runners.
          </p>
        </>
      )}
    >
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

      {/* PROBLEM */}
      <Chapter title={t('Le problème', 'The problem')}>
        <p>
          {t(
            'Pendant un fractionné, trois questions reviennent sans cesse : où j’en suis, est-ce que je cours à la bonne allure, et quand est-ce que ça change. Les montres de sport y répondent en affichant tout à la fois.',
            'During intervals, three questions keep coming back: where am I, am I running at the right pace, and when does it change. Sports watches answer by showing everything at once.'
          )}
        </p>
        <p>
          {t(
            'Le benchmark couvre Garmin, Apple Watch, Runna et Strava. Côté coureurs, un premier retour de terrain oriente le projet : deux informations regardées, la distance restante et l’allure, une programmation jugée pénible, et une frustration, le temps de repos.',
            'The benchmark covers Garmin, Apple Watch, Runna and Strava. On the runners’ side, a first piece of field feedback steers the project: two things looked at, distance left and pace, set-up felt as a chore, and one frustration, rest time.'
          )}
        </p>
      </Chapter>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {problems(t).map((p) => (
          <li key={p.title} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <span className="text-[13px] text-black/45">{p.when}</span>
            <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug">{p.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{p.text}</p>
          </li>
        ))}
      </ol>

      {/* CONCEPT */}
      <Chapter title={t('Le concept', 'The concept')}>
        <p>
          {t(
            'Trois moments, une idée par moment. Le téléphone prépare et conclut ; la montre ne garde que ce qui se lit en courant.',
            'Three moments, one idea each. The phone prepares and wraps up; the watch keeps only what can be read while running.'
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
            <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug">{m.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{m.text}</p>
          </li>
        ))}
      </ol>

      {/* PRINCIPLE */}
      <Chapter title={t('Le principe', 'The principle')}>
        <p>
          {t(
            'Anatomie d’un coup d’œil. Une seconde ne suffit pas pour lire un écran. Elle suffit pour en lire une couche à la fois, toujours dans le même ordre. L’interface de la montre vise cette lecture en trois temps.',
            'Anatomy of a glance. One second is not enough to read a screen. It is enough to read one layer at a time, always in the same order. The watch interface is designed for that three-step read.'
          )}
        </p>
      </Chapter>
      <div className="space-y-3">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
          {glance(t).map((g) => (
            <li key={g.title} className="bg-white p-6 md:p-8 flex flex-col gap-3">
              <span className="text-[15vw] md:text-[5.2vw] font-medium leading-[0.95] tracking-[-0.045em]">{g.time}</span>
              <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug pt-4">{g.title}</h4>
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
            <h4 className="text-2xl md:text-[2.6vw] font-medium tracking-[-0.035em] leading-[1.05]">
              {t('Un écran, quatre couches. Chacune ne dit qu’une chose.', 'One screen, four layers. Each says only one thing.')}
            </h4>
          </div>
          <ol className="divide-y divide-black/15 border-t border-black/15">
            {layers(t).map((l) => (
              <li key={l.n} className="grid grid-cols-[3rem_1fr] gap-2 py-4">
                <span className="text-[13px] text-black/45 pt-0.5">{l.n}</span>
                <div className="space-y-1">
                  <h5 className="text-[15px] font-medium">{l.title}</h5>
                  <p className="text-sm text-black/60 leading-relaxed">{l.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* WATCH */}
      <Chapter title={t('La montre', 'The watch')}>
        <p>
          {t(
            'Le verre change de teinte, la structure ne bouge jamais : le mot en haut, le chiffre au centre, le détail en dessous. Bleuté en récupération, neutre en effort, rosé hors de la cible.',
            'The glass changes tint, the structure never moves: the word on top, the number in the centre, the detail below. Bluish in recovery, neutral in effort, rose when off target.'
          )}
        </p>
        <p>
          {t(
            'La couleur ne porte jamais l’information seule : le mot la dit toujours.',
            'Colour never carries the information alone: the word always says it.'
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
        <div className="md:col-span-5 bg-[#ecedef] p-10 md:p-14 flex items-center justify-center">
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
                <h4 className="text-lg md:text-xl font-medium tracking-[-0.03em] leading-snug">{r.title}</h4>
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
              {t('Chaque écran répond à une seule question.', 'Each screen answers a single question.')}
            </p>
          </li>
        </ol>
        <Caption>{t('Une séance complète : seize écrans et une option.', 'A full session: sixteen screens and one option.')}</Caption>
      </div>

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
            'Le poignet prévient avant l’écran. Trois signaux, toujours dans le même ordre : ça va changer, ça change, tu sors de la cible.',
            'The wrist warns before the screen does. Three signals, always in the same order: it is about to change, it changes, you are off target.'
          )}
        </p>
      </Chapter>
      <div className="border border-black/15 p-5 md:p-10 overflow-x-auto">
        <HapticScore t={t} />
      </div>

      {/* DRAWN DATA */}
      <Chapter title={t('La donnée, dessinée', 'Data, drawn')}>
        <p>
          {t(
            'Du blanc, du verre fumé et des points. Chaque illustration est une mesure : on reconnaît la forme avant de lire le chiffre.',
            'White, smoked glass and dots. Every illustration is a measurement: you recognise the shape before you read the number.'
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
                <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug">{d.title}</h4>
                <p className="text-sm text-black/60 leading-relaxed max-w-md">{d.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* PHONE */}
      <Chapter title={t('Le téléphone', 'The phone')}>
        <p>
          {t(
            'La séance s’écrit comme une phrase : huit fois quatre cents mètres à 4:00, récupération une minute. Chaque valeur se touche et se modifie.',
            'The session is written as a sentence: eight times four hundred metres at 4:00, one minute recovery. Each value can be tapped and changed.'
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
      <Chapter title={t('La suite', 'What’s next')}>
        <p>
          {t(
            'Prochaine étape : confronter le concept à des coureurs. Un test de lisibilité en mouvement pour fixer la taille des chiffres, puis un test du prototype sur piste. Viendra ensuite la déclinaison pour montre rectangulaire.',
            'Next step: putting the concept in front of runners. A legibility test in motion to settle the size of the numbers, then a prototype test on the track. A version for rectangular watches will follow.'
          )}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
