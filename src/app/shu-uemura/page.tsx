'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

const screen = (file: string, alt: string) => ({ src: `/shu-flow-${file}.png`, alt: `Shu Uemura — ${alt}` });

const steps = [
  {
    n: '01',
    title: 'Choisir son mentor',
    text: 'La cliente choisit son coach virtuel parmi Yoko, Ren ou Haruto, chacun avec sa propre signature beauté.',
    screens: [screen('01-cover', 'écran d’accueil AI:tutor'), screen('02-select-haruto', 'sélection du mentor')],
  },
  {
    n: '02',
    title: 'Échanger',
    text: 'Un chat guidé pour cerner les besoins de la cliente, jusqu’à proposer un tutoriel filmé en direct.',
    screens: [screen('03-chat', 'conversation avec Haruto'), screen('04-camera-cta', 'activation de la caméra')],
  },
  {
    n: '03',
    title: 'Analyser le visage',
    text: 'Reconnaissance des proportions du visage, puis recommandation de la forme de sourcil la plus adaptée.',
    screens: [screen('05-face-scan', 'analyse faciale'), screen('06-brow-shape', 'recommandation de forme')],
  },
  {
    n: '04',
    title: 'Apprendre le geste',
    text: 'Un tutoriel pas-à-pas avec repères sur le visage et le produit Shu Uemura associé à chaque étape.',
    screens: [screen('07-pencil', 'tutoriel, crayon sourcils'), screen('08-flex-styler', 'tutoriel, flex styler')],
  },
];

export default function Page() {
  return (
    <ProjectPage
      title="Shu Uemura AI:tutor"
      subtitle="Un coach beauté IA personnel, sur mobile"
      meta={[
        { label: 'Année', value: '2024' },
        { label: 'Contexte', value: 'OKCC' },
        { label: 'Rôle', value: 'UI Design, vidéo de présentation IA' },
        { label: 'Outils', value: 'Figma, Runway, Kling' },
      ]}
      intro={
        <>
          <p>
            Shu Uemura voulait un assistant capable de guider ses clientes dans le choix et
            l&apos;application de leurs produits, comme un coach beauté personnel accessible
            depuis mobile.
          </p>
          <p>
            J&apos;ai conçu les maquettes de bout en bout, en échange direct avec le client sur
            trois itérations. Chacune a affiné un point précis : mieux mettre en avant le
            savoir-faire de la marque, rendre la personnalisation réellement fidèle au visage de
            chaque cliente, et jusqu&apos;au choix des décors, avec des mannequins IA posés
            devant du béton façon Tokyo pour ancrer l&apos;univers visuel.
          </p>
          <p>
            En complément, j&apos;ai produit une vidéo générée par IA pour présenter le concept
            directement au CEO de Shu Uemura, avant même le développement. Le concept a été très
            bien reçu, et le projet livré.
          </p>
        </>
      }
      next={{ href: '/serena', title: 'Serena' }}
    >
      {steps.map((step, i) => (
        <div key={step.n}>
          <Chapter title={`${step.n} — ${step.title}`}>
            <p>{step.text}</p>
          </Chapter>
          <Row cols={2} mobileCols={2} className="max-w-3xl mx-auto">
            {step.screens.map((s) => (
              <Media key={s.src} src={s.src} alt={s.alt} width={390} height={844} priority={i === 0} />
            ))}
          </Row>
        </div>
      ))}

      <Chapter title="05 — Prolonger en boutique">
        <p>L&apos;expérience se conclut sur les produits utilisés et une prise de rendez-vous avec les maquilleurs en boutique.</p>
      </Chapter>
      <Media src="/shu-flow-09-recommendations.png" alt="Shu Uemura — recommandations produits et rendez-vous" width={390} height={844} className="max-w-[340px] mx-auto" />
    </ProjectPage>
  );
}
