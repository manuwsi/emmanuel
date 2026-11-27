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
      'L’IA sert à remplir les documents et à préparer les démarches.',
      'AI is there to fill in documents and prepare the paperwork.'
    ),
  },
  {
    title: t('Formés à tout, sauf à l’administratif', 'Trained for everything except paperwork'),
    quote: t(
      'T’as des formations pour épandre, mais rien pour utiliser les sites administratifs.',
      'There’s training for spreading fertiliser, but nothing for using the admin websites.'
    ),
    answer: t(
      'Des écrans simples, sans jargon administratif.',
      'Simple screens, with no admin jargon.'
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
      lede={t(
        'Un assistant qui prépare la paperasse des agriculteurs. Ils n’ont plus qu’à vérifier et valider.',
        'An assistant that prepares farmers’ paperwork. All they have left to do is check and approve.'
      )}
      meta={{
        year: '2025',
        context: t('Projet d’équipe, ESD', 'Team project, ESD'),
        role: t('Concept produit, wireframes, UI desktop & mobile', 'Product concept, wireframes, desktop & mobile UI'),
        tools: 'Figma',
      }}
      intro={t(
        <>
          <p>
            En France, un agriculteur passe jusqu&apos;à une heure par jour sur
            l&apos;administratif, et souvent une journée de son week-end. Ça s&apos;ajoute à un
            métier déjà dur, dans un secteur qui compte environ 1,5 suicide par jour.
          </p>
          <p>
            Serena regroupe les tâches et les documents de l&apos;exploitation, remplit les
            formulaires et prépare les démarches. L&apos;agriculteur garde la main : rien ne part
            sans sa validation, et il sait ce qui est fait de ses données.
          </p>
          <p>
            Projet d&apos;équipe à l&apos;ESD. Nous avons interrogé des agriculteurs avant de
            dessiner. J&apos;ai porté le concept produit et le design, des premiers wireframes aux
            écrans finaux, sur ordinateur et sur mobile.
          </p>
        </>,
        <>
          <p>
            In France, a farmer spends up to an hour a day on paperwork, and often a full day of
            the weekend. It comes on top of a hard job, in a sector that sees around 1.5 suicides
            a day.
          </p>
          <p>
            Serena gathers the farm&apos;s tasks and documents, fills in forms and prepares the
            paperwork. The farmer stays in control: nothing goes out without their approval, and
            they know what happens to their data.
          </p>
          <p>
            A team project at ESD. We interviewed farmers before drawing anything. I led the
            product concept and design, from the first wireframes to the final desktop and
            mobile screens.
          </p>
        </>
      )}
    >
      <Media src="/serena-dashboard.png" alt={t('Serena — tableau de bord', 'Serena — dashboard')} width={1010} height={632} priority className="max-w-4xl mx-auto" />

      {/* RESEARCH */}
      <Chapter n={1} title={t('Le terrain', 'The field')} lede={t('Avant de dessiner, nous sommes allés parler à des agriculteurs.', 'Before drawing anything, we went and talked to farmers.')}>
        <p>
          {t(
            'Nous avons d’abord listé ce que les chiffres publics ne disaient pas et écrit nos hypothèses. Puis un questionnaire en quatre thèmes, et des entretiens. Voici ce qui en est ressorti, et ce que nous en avons fait.',
            'We first listed what public figures couldn’t tell us and wrote down our assumptions. Then a four-theme questionnaire, and interviews. Here is what came out of it, and what we did with it.'
          )}
        </p>
      </Chapter>
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/15 border border-black/15">
        {researchSteps(t).map((s, i) => (
          <li key={s.title} className="bg-white p-5 md:p-6 space-y-2">
            <span className="text-[0.65rem] tracking-widest text-black/45">0{i + 1}</span>
            <h4 className="text-[13px] font-medium">{s.title}</h4>
            <p className="text-xs text-black/50 leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>

      <div className="!mt-10 md:!mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/15 border border-black/15">
        {insights(t).map((ins, i) => (
          <div key={ins.title} className="bg-white p-6 md:p-10 flex flex-col gap-6">
            <span className="text-[13px] text-black/45">
              {t('Enseignement', 'Insight')} 0{i + 1}
            </span>
            <h4 className="font-medium">{ins.title}</h4>
            <blockquote className="text-sm md:text-base italic text-black/70 leading-relaxed border-l border-[#eed349] pl-4">
              {`« ${ins.quote} »`}
            </blockquote>
            <p className="mt-auto text-xs text-black/50 leading-relaxed">
              <span className="text-[#eed349]">→ </span>
              {ins.answer}
            </p>
          </div>
        ))}
      </div>

      {/* ITERATIONS */}
      <Chapter n={2} title={t('Itérations', 'Iterations')} lede={t('D’un chat posé sur une liste à un tableau de bord qui propose des actions.', 'From a chat on top of a list to a dashboard that suggests actions.')}>
        <p>
          {t(
            'La V1, encore baptisée Agriprev, posait une fenêtre de chat sur une simple liste de tâches. La V2 recentre le tableau de bord sur les tâches et les documents, ajoute des statuts, le choix de l’exploitation, et place l’assistant en bas de l’écran avec des actions proposées plutôt qu’un chat vide.',
            'V1, still called Agriprev, placed a chat window over a plain task list. V2 refocuses the dashboard on tasks and documents, adds statuses and a farm switcher, and moves the assistant to the bottom of the screen with suggested actions instead of an empty chat.'
          )}
        </p>
      </Chapter>
      <div className="max-w-4xl mx-auto space-y-3">
        <span className="block text-[13px] text-black/45">{t('Wireframe V1 — Agriprev', 'Wireframe V1 — Agriprev')}</span>
        <div className="grid grid-cols-[3.4fr_1fr] gap-4 md:gap-8 items-end">
          <Media src="/serena-wf-v1-desktop.png" alt={t('Serena — wireframe V1 desktop', 'Serena — V1 desktop wireframe')} width={702} height={426} />
          <Media src="/serena-wf-v1-mobile.png" alt={t('Serena — wireframe V1 mobile', 'Serena — V1 mobile wireframe')} width={205} height={425} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto space-y-3 pt-6">
        <span className="block text-[13px] text-black/45">{t('Wireframe V2', 'Wireframe V2')}</span>
        <Media src="/serena-wf-v2-desktop.png" alt={t('Serena — wireframe V2', 'Serena — V2 wireframe')} width={704} height={427} />
      </div>
      <div className="max-w-4xl mx-auto space-y-3 pt-6">
        <span className="block text-[13px] text-black/45">{t('Maquette V1', 'Mockup V1')}</span>
        <Media src="/serena-mockup-v1.png" alt={t('Serena — première maquette', 'Serena — first mockup')} width={1017} height={620} />
        <p className="text-xs text-black/50 leading-relaxed max-w-2xl pt-2">
          {t(
            'Première mise en couleur : la barre latérale entièrement vert foncé rendait l’interface lourde. La version finale l’éclaircit et garde le vert pour les accents.',
            'First colour pass: the fully dark-green sidebar made the interface feel heavy. The final version lightens it and keeps green for accents.'
          )}
        </p>
      </div>

      <Chapter n={3} title={t('Version finale — ordinateur', 'Final version — desktop')}>
        <p>
          {t(
            'L’assistant n’est pas une fenêtre de chat à part. Il apparaît là où on en a besoin : des actions proposées sur le tableau de bord, les tâches classées par priorité, les documents rangés automatiquement.',
            'The assistant isn’t a separate chat window. It shows up where it’s needed: suggested actions on the dashboard, tasks sorted by priority, documents filed automatically.'
          )}
        </p>
      </Chapter>
      <Media src="/serena-tasks.png" alt={t('Serena — gestion des tâches', 'Serena — tasks')} width={1011} height={631} className="max-w-4xl mx-auto" />
      <Row cols={2}>
        <Media src="/serena-documents.png" alt={t('Serena — bibliothèque de documents', 'Serena — document library')} width={1046} height={653} />
        <Media src="/serena-doc-viewer.png" alt={t('Serena — lecture de document', 'Serena — document viewer')} width={1047} height={653} />
      </Row>

      <Chapter n={4} title={t('Version finale — mobile', 'Final version — mobile')}>
        <p>
          {t(
            'Dans la cour ou au champ, l’agriculteur scanne un document avec son téléphone et l’assistant le range.',
            'In the yard or the field, the farmer scans a document with their phone and the assistant files it.'
          )}
        </p>
      </Chapter>
      <Row cols={3} mobileCols={2} align="end" className="max-w-3xl mx-auto">
        <Media src="/serena-mobile-chat.png" alt={t('Serena — assistant mobile', 'Serena — mobile assistant')} width={283} height={591} />
        <Media src="/serena-mobile-scan.png" alt={t('Serena — scan de document', 'Serena — document scan')} width={375} height={759} />
        <Media src="/serena-mobile-tasks.png" alt={t('Serena — tâches mobile', 'Serena — mobile tasks')} width={368} height={768} />
      </Row>

      <Chapter n={5} title={t('Identité', 'Identity')}>
        <p>
          {t(
            'Un vert profond et un jaune chaud, pour se démarquer des logiciels de gestion agricole, souvent froids. L’assistant parle simplement, avec des phrases courtes.',
            'A deep green and a warm yellow, to stand apart from farm management software, which tends to feel cold. The assistant speaks plainly, in short sentences.'
          )}
        </p>
      </Chapter>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 py-6">
        <Image src="/serena-logo.png" alt={t('Logo Serena', 'Serena logo')} width={1166} height={463} className="w-64 md:w-80 h-auto" />
        <div className="flex gap-5 md:gap-6">
          {palette.map((c) => (
            <div key={c.hex} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
              <span className="text-[13px] text-black/45">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </ProjectPage>
  );
}
