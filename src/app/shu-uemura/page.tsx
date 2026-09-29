'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  const screen = (file: string, fr: string, en: string) => ({
    src: `/shu-flow-${file}.png`,
    alt: `Shu Uemura — ${t(fr, en)}`,
  });

  const steps = [
    {
      n: '01',
      title: t('Choisir son mentor', 'Choose a mentor'),
      text: t(
        'La cliente choisit son coach virtuel parmi Yoko, Ren ou Haruto, chacun avec sa propre signature beauté.',
        'The client picks her virtual coach among Yoko, Ren and Haruto, each with a distinct beauty signature.'
      ),
      screens: [
        screen('01-cover', 'écran d’accueil AI:tutor', 'AI:tutor welcome screen'),
        screen('02-select-haruto', 'sélection du mentor', 'mentor selection'),
      ],
    },
    {
      n: '02',
      title: t('Échanger', 'Talk'),
      text: t(
        'Un chat guidé pour cerner les besoins de la cliente, jusqu’à proposer un tutoriel filmé en direct.',
        'A guided chat to understand the client’s needs, leading to a live camera tutorial.'
      ),
      screens: [
        screen('03-chat', 'conversation avec Haruto', 'chat with Haruto'),
        screen('04-camera-cta', 'activation de la caméra', 'turning on the camera'),
      ],
    },
    {
      n: '03',
      title: t('Analyser le visage', 'Read the face'),
      text: t(
        'Reconnaissance des proportions du visage, puis recommandation de la forme de sourcil la plus adaptée.',
        'Facial proportions are analysed, then the best-suited brow shape is recommended.'
      ),
      screens: [
        screen('05-face-scan', 'analyse faciale', 'face analysis'),
        screen('06-brow-shape', 'recommandation de forme', 'shape recommendation'),
      ],
    },
    {
      n: '04',
      title: t('Apprendre le geste', 'Learn the technique'),
      text: t(
        'Un tutoriel pas-à-pas avec repères sur le visage et le produit Shu Uemura associé à chaque étape.',
        'A step-by-step tutorial with guides on the face and the matching Shu Uemura product at each step.'
      ),
      screens: [
        screen('07-pencil', 'tutoriel, crayon sourcils', 'tutorial, brow pencil'),
        screen('08-flex-styler', 'tutoriel, flex styler', 'tutorial, flex styler'),
      ],
    },
  ];

  return (
    <ProjectPage
      title="Shu Uemura AI:tutor"
      subtitle={t('Un coach beauté IA personnel, sur mobile', 'A personal AI beauty coach, on mobile')}
      meta={{
        year: '2025',
        context: 'OKCC',
        role: t('UI Design, vidéo de présentation IA', 'UI design, AI concept video'),
        tools: 'Figma, Runway, Kling',
      }}
      intro={t(
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
        </>,
        <>
          <p>
            Shu Uemura wanted an assistant able to guide clients in choosing and applying their
            products, like a personal beauty coach available on mobile.
          </p>
          <p>
            I designed the screens end to end, working directly with the client over three
            iterations. Each one sharpened a specific point: showcasing the brand&apos;s
            craftsmanship, making personalisation truly faithful to each client&apos;s face, and
            even the choice of settings, with AI models posed against Tokyo-style concrete to
            anchor the visual world.
          </p>
          <p>
            Alongside the screens, I produced an AI-generated video to present the concept
            directly to Shu Uemura&apos;s CEO, before development even started. The concept was
            very well received, and the project was delivered.
          </p>
        </>
      )}
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

      <Chapter title={t('05 — Prolonger en boutique', '05 — Continue in store')}>
        <p>
          {t(
            'L’expérience se conclut sur les produits utilisés et une prise de rendez-vous avec les maquilleurs en boutique.',
            'The experience ends with the products used and a booking with the in-store make-up artists.'
          )}
        </p>
      </Chapter>
      <Media
        src="/shu-flow-09-recommendations.png"
        alt={t('Shu Uemura — recommandations produits et rendez-vous', 'Shu Uemura — product picks and booking')}
        width={390}
        height={844}
        className="max-w-[340px] mx-auto"
      />

      {/* ITERATIONS */}
      <Chapter title={t('Itérations', 'Iterations')}>
        <p>
          {t(
            'Le premier jet posait les bases fonctionnelles : un compte, une galerie de demandes et un chat texte neutre. La V1 installe l’univers de marque (rouge Shu Uemura, choix d’un mentor, analyse faciale) mais reste générique. La version finale ancre tout dans le savoir-faire maison : mesures du visage propres à Shu Uemura, décors béton façon Tokyo et tutoriels liés aux produits.',
            'The first draft laid the functional groundwork: an account, a request gallery and a neutral text chat. V1 brought in the brand world (Shu Uemura red, mentor choice, face analysis) but stayed generic. The final version roots everything in the house’s craft: Shu Uemura’s own face measurements, Tokyo-style concrete settings and product-linked tutorials.'
          )}
        </p>
      </Chapter>
      <div className="max-w-3xl mx-auto space-y-3">
        <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">{t('Premier jet', 'First draft')}</span>
        <Row cols={3} mobileCols={2}>
          <Media src="/shu-draft-login.png" alt={t('Shu Uemura — premier jet, connexion', 'Shu Uemura — first draft, login')} width={390} height={844} />
          <Media src="/shu-draft-requests.png" alt={t('Shu Uemura — premier jet, galerie de demandes', 'Shu Uemura — first draft, request gallery')} width={390} height={844} />
          <Media src="/shu-draft-chat.png" alt={t('Shu Uemura — premier jet, chat', 'Shu Uemura — first draft, chat')} width={390} height={844} className="hidden md:block" />
        </Row>
      </div>
      <div className="max-w-3xl mx-auto space-y-3 pt-6">
        <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">V1</span>
        <Row cols={3} mobileCols={2}>
          <Media src="/shu-v1-cover.png" alt={t('Shu Uemura — V1, accueil', 'Shu Uemura — V1, welcome')} width={390} height={844} />
          <Media src="/shu-v1-mentor.png" alt={t('Shu Uemura — V1, choix du mentor', 'Shu Uemura — V1, mentor choice')} width={390} height={844} />
          <Media src="/shu-v1-facemesh.png" alt={t('Shu Uemura — V1, analyse faciale', 'Shu Uemura — V1, face analysis')} width={390} height={844} className="hidden md:block" />
        </Row>
      </div>

      {/* STORYBOARD */}
      <Chapter title={t('Le film de présentation', 'The concept film')}>
        <p>
          {t(
            'Pour convaincre avant le développement, j’ai écrit et produit un film en IA présenté au CEO de Shu Uemura : du geste d’un maquilleur de la maison jusqu’aux mentors virtuels qui accompagnent chaque cliente.',
            'To win buy-in before development, I wrote and produced an AI film shown to Shu Uemura’s CEO: from the gesture of a house make-up artist to the virtual mentors guiding each client.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        {[
          { n: 1, fr: 'La cliente choisit son mentor.', en: 'The client picks her mentor.' },
          { n: 2, fr: 'Le mentor apparaît et engage la conversation.', en: 'The mentor appears and starts the conversation.' },
          { n: 3, fr: 'Les mesures Shu Uemura se dessinent sur le visage.', en: 'Shu Uemura’s measurements are drawn on the face.' },
          { n: 4, fr: 'Les trois mentors accompagnent des milliers de clientes.', en: 'The three mentors guide thousands of clients.' },
        ].map((f) => (
          <figure key={f.n} className="space-y-3">
            <Media src={`/shu-sb-${f.n}.jpg`} alt={t(`Storyboard — ${f.fr}`, `Storyboard — ${f.en}`)} width={540} height={292} />
            <figcaption className="text-xs text-gray-400">
              <span className="text-neutral-400 tabular-nums">0{f.n} — </span>
              {t(f.fr, f.en)}
            </figcaption>
          </figure>
        ))}
      </Row>
    </ProjectPage>
  );
}
