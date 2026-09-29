'use client';

import Image from 'next/image';
import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

type T = <V,>(fr: V, en: V) => V;

const researchSteps = (t: T) => [
  {
    title: t('Zones d’ombre', 'Blind spots'),
    text: t('Ce que les chiffres en ligne ne permettent pas de comprendre.', 'What online figures can’t explain.'),
  },
  {
    title: t('Hypothèses', 'Assumptions'),
    text: t('Charge mentale, isolement, outils dispersés, rapport à la tech.', 'Mental load, isolation, scattered tools, attitude to tech.'),
  },
  {
    title: t('Questionnaire', 'Questionnaire'),
    text: t('Usages et outils, charge mentale, réseaux, vision d’avenir.', 'Tools and habits, mental load, networks, outlook.'),
  },
  {
    title: t('Entretiens', 'Interviews'),
    text: t('Échanges avec des agriculteurs, puis synthèse des réponses.', 'Conversations with farmers, then a synthesis of answers.'),
  },
];

const insights = (t: T) => [
  {
    title: t('L’administratif déborde sur la vie privée', 'Paperwork spills into private life'),
    quote: t(
      'Avoir un site web qui regroupe toute la paperasse, car on le fait le soir.',
      'A website that gathers all the paperwork, because we do it in the evening.'
    ),
    answer: t(
      'Un seul espace qui centralise tâches et documents, dès le tableau de bord.',
      'A single space centralising tasks and documents, right from the dashboard.'
    ),
  },
  {
    title: t('La technologie est adoptée quand elle soulage', 'Technology is adopted when it takes the load off'),
    quote: t(
      'Un robot de traite change la vie. Avant, t’étais obligé d’y aller à 6h le dimanche. Avec le robot, non.',
      'A milking robot changes your life. You used to have to go at 6am on Sundays. With the robot, you don’t.'
    ),
    answer: t(
      'L’IA n’est pas un gadget : elle remplit les documents et prépare les démarches.',
      'AI isn’t a gimmick: it fills in documents and prepares the paperwork.'
    ),
  },
  {
    title: t('Formés à tout, sauf à l’administratif', 'Trained for everything except paperwork'),
    quote: t(
      'T’as des formations pour épandre, mais rien pour utiliser les sites administratifs.',
      'There’s training for spreading fertiliser, but nothing for using the admin websites.'
    ),
    answer: t(
      'Une interface claire, sans jargon ni surcharge technique.',
      'A clear interface, with no jargon or technical clutter.'
    ),
  },
  {
    title: t('Garder la main', 'Staying in control'),
    quote: t(
      'J’utiliserai peut-être pas la reco vocale, mais j’aime bien faire le truc moi-même.',
      'I might not use voice recognition, but I like doing things myself.'
    ),
    answer: t(
      'L’assistant propose, l’agriculteur vérifie et valide.',
      'The assistant suggests; the farmer checks and approves.'
    ),
  },
];

export default function Page() {
  const t = useT();
  const palette = [
    { hex: '#0b3628', label: t('Vert profond', 'Deep green') },
    { hex: '#629784', label: t('Vert sauge', 'Sage green') },
    { hex: '#eed349', label: t('Jaune', 'Yellow') },
    { hex: '#e6f9d4', label: t('Vert clair', 'Light green') },
  ];

  return (
    <ProjectPage
      title="Serena"
      subtitle={t('Un assistant IA pour l’administratif agricole', 'An AI assistant for farm paperwork')}
      meta={{
        year: '2024',
        context: t('Projet d’équipe, ESD', 'Team project, ESD'),
        role: t('Concept produit, wireframes, UI desktop & mobile', 'Product concept, wireframes, desktop & mobile UI'),
        tools: 'Figma',
      }}
      intro={t(
        <>
          <p>
            1,5 suicides par jour en France dans le secteur agricole. Les agriculteurs passent
            aujourd&apos;hui jusqu&apos;à 1h par jour, et une journée entière de leur week-end,
            à gérer des tâches administratives, une charge mentale qui s&apos;ajoute à un métier
            déjà exigeant.
          </p>
          <p>
            Serena répond à ce constat avec un assistant pensé pour prendre en charge
            l&apos;ensemble de ces démarches : automatisé, disponible, transparent sur
            l&apos;usage des données, et personnalisé selon les besoins de chaque exploitation.
          </p>
          <p>
            Des interviews terrain avec des agriculteurs ont nourri la compréhension du besoin
            réel. J&apos;ai porté le concept produit et le design, du wireframing des premières
            pistes jusqu&apos;aux maquettes finales, desktop et mobile.
          </p>
        </>,
        <>
          <p>
            In France, the farming sector sees 1.5 suicides a day. Farmers spend up to an hour
            a day, and a full day of their weekend, on paperwork: a mental load on top of an
            already demanding job.
          </p>
          <p>
            Serena answers this with an assistant built to handle all of that admin: automated,
            always available, transparent about data use, and tailored to each farm&apos;s needs.
          </p>
          <p>
            Field interviews with farmers shaped our understanding of the real need. I led the
            product concept and design, from the first wireframes to the final desktop and
            mobile screens.
          </p>
        </>
      )}
    >
      <Media src="/serena-dashboard.png" alt={t('Serena — tableau de bord', 'Serena — dashboard')} width={1010} height={632} priority className="max-w-4xl mx-auto" />

      {/* RESEARCH */}
      <Chapter title={t('Comprendre le terrain', 'Understanding the field')}>
        <p>
          {t(
            'Avant de dessiner quoi que ce soit, nous avons listé ce que les données publiques ne disaient pas, formulé nos hypothèses, puis construit un questionnaire en quatre thèmes pour aller interroger des agriculteurs.',
            'Before drawing anything, we listed what public data couldn’t tell us, wrote down our assumptions, then built a four-theme questionnaire to interview farmers.'
          )}
        </p>
      </Chapter>
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800 border border-neutral-800">
        {researchSteps(t).map((s, i) => (
          <li key={s.title} className="bg-[#0a0a0a] p-5 md:p-6 space-y-2">
            <span className="text-[0.65rem] tracking-widest text-neutral-400">0{i + 1}</span>
            <h4 className="text-sm uppercase tracking-wide text-white">{s.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>

      <div className="!mt-10 md:!mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800 border border-neutral-800">
        {insights(t).map((ins, i) => (
          <div key={ins.title} className="bg-[#0a0a0a] p-6 md:p-10 flex flex-col gap-6">
            <span className="text-[0.65rem] uppercase tracking-widest text-neutral-400">
              {t('Enseignement', 'Insight')} 0{i + 1}
            </span>
            <h4 className="text-xl md:text-2xl font-ivy font-light text-white leading-snug">{ins.title}</h4>
            <blockquote className="text-sm md:text-base italic text-gray-300 leading-relaxed border-l border-[#eed349] pl-4">
              {`« ${ins.quote} »`}
            </blockquote>
            <p className="mt-auto text-xs text-gray-400 leading-relaxed">
              <span className="text-[#eed349]">→ </span>
              {ins.answer}
            </p>
          </div>
        ))}
      </div>

      {/* ITERATIONS */}
      <Chapter title={t('Itérations', 'Iterations')}>
        <p>
          {t(
            'La V1, encore baptisée Agriprev, posait une fenêtre de chat sur une simple liste de tâches. La V2 recentre le tableau de bord sur les tâches et les documents, ajoute des statuts, le choix de l’exploitation, et place l’assistant en bas de l’écran avec des actions proposées plutôt qu’un chat vide.',
            'V1, still called Agriprev, placed a chat window over a plain task list. V2 refocuses the dashboard on tasks and documents, adds statuses and a farm switcher, and moves the assistant to the bottom of the screen with suggested actions instead of an empty chat.'
          )}
        </p>
      </Chapter>
      <div className="max-w-4xl mx-auto space-y-3">
        <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">{t('Wireframe V1 — Agriprev', 'Wireframe V1 — Agriprev')}</span>
        <div className="grid grid-cols-[3.4fr_1fr] gap-4 md:gap-8 items-end">
          <Media src="/serena-wf-v1-desktop.png" alt={t('Serena — wireframe V1 desktop', 'Serena — V1 desktop wireframe')} width={702} height={426} />
          <Media src="/serena-wf-v1-mobile.png" alt={t('Serena — wireframe V1 mobile', 'Serena — V1 mobile wireframe')} width={205} height={425} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto space-y-3 pt-6">
        <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">{t('Wireframe V2', 'Wireframe V2')}</span>
        <Media src="/serena-wf-v2-desktop.png" alt={t('Serena — wireframe V2', 'Serena — V2 wireframe')} width={704} height={427} />
      </div>
      <div className="max-w-4xl mx-auto space-y-3 pt-6">
        <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">{t('Maquette V1', 'Mockup V1')}</span>
        <Media src="/serena-mockup-v1.png" alt={t('Serena — première maquette', 'Serena — first mockup')} width={1017} height={620} />
        <p className="text-xs text-gray-400 leading-relaxed max-w-2xl pt-2">
          {t(
            'Première mise en couleur : la barre latérale entièrement vert foncé rendait l’interface lourde. La version finale l’allège et réserve le vert aux accents, pour un outil qui rassure plutôt qu’il ne pèse.',
            'First colour pass: the fully dark-green sidebar made the interface feel heavy. The final version lightens it and keeps green for accents, so the tool reassures rather than weighs down.'
          )}
        </p>
      </div>

      <Chapter title={t('Version finale — desktop', 'Final version — desktop')}>
        <p>
          {t(
            'L’assistant est pensé comme un fil conducteur plutôt qu’un simple chatbot : suggestions d’actions contextuelles sur le tableau de bord, tâches priorisées, et bibliothèque de documents classés automatiquement.',
            'The assistant runs through the whole product rather than being a simple chatbot: contextual action suggestions on the dashboard, prioritised tasks, and a document library sorted automatically.'
          )}
        </p>
      </Chapter>
      <Media src="/serena-tasks.png" alt={t('Serena — gestion des tâches', 'Serena — tasks')} width={1011} height={631} className="max-w-4xl mx-auto" />
      <Row cols={2}>
        <Media src="/serena-documents.png" alt={t('Serena — bibliothèque de documents', 'Serena — document library')} width={1046} height={653} />
        <Media src="/serena-doc-viewer.png" alt={t('Serena — lecture de document', 'Serena — document viewer')} width={1047} height={653} />
      </Row>

      <Chapter title={t('Version finale — mobile', 'Final version — mobile')}>
        <p>
          {t(
            'Sur le terrain, l’agriculteur scanne un document depuis son téléphone pour alimenter l’assistant directement.',
            'Out in the field, farmers scan a document with their phone to feed the assistant directly.'
          )}
        </p>
      </Chapter>
      <Row cols={3} mobileCols={2} align="end" className="max-w-3xl mx-auto">
        <Media src="/serena-mobile-chat.png" alt={t('Serena — assistant mobile', 'Serena — mobile assistant')} width={283} height={591} />
        <Media src="/serena-mobile-scan.png" alt={t('Serena — scan de document', 'Serena — document scan')} width={375} height={759} />
        <Media src="/serena-mobile-tasks.png" alt={t('Serena — tâches mobile', 'Serena — mobile tasks')} width={368} height={768} />
      </Row>

      <Chapter title={t('Identité', 'Identity')}>
        <p>
          {t(
            'Une identité pensée pour rassurer plutôt qu’imposer : un vert profond et un jaune chaleureux, loin du vocabulaire froid des logiciels de gestion habituels du secteur. Serena s’exprime avec calme, clarté et bienveillance.',
            'An identity designed to reassure rather than impose: a deep green and a warm yellow, far from the cold vocabulary of the sector’s usual management software. Serena speaks with calm, clarity and kindness.'
          )}
        </p>
      </Chapter>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 py-6">
        <Image src="/serena-logo.png" alt={t('Logo Serena', 'Serena logo')} width={1166} height={463} className="w-64 md:w-80 h-auto" />
        <div className="flex gap-5 md:gap-6">
          {palette.map((c) => (
            <div key={c.hex} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-neutral-700" style={{ backgroundColor: c.hex }} />
              <span className="text-[0.6rem] uppercase tracking-widest text-neutral-400">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </ProjectPage>
  );
}
