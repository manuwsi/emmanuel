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
        'Quelques questions dans un chat pour comprendre ce que veut la cliente, puis le mentor lui propose d’allumer la caméra.',
        'A few questions in a chat to understand what the client wants, then the mentor offers to turn on the camera.'
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
        'L’appli mesure les proportions du visage et recommande la forme de sourcil qui lui va.',
        'The app measures the face’s proportions and recommends the brow shape that suits it.'
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
        'Un tutoriel étape par étape, avec des repères sur le visage et le produit Shu Uemura à utiliser à chaque fois.',
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
      lede={t(
        'Un coach maquillage sur mobile qui lit le visage de la cliente et lui montre le geste, produit par produit.',
        'A mobile make-up coach that reads the client’s face and shows her the technique, product by product.'
      )}
      meta={{
        year: '2025',
        context: 'OKCC',
        role: t('UI Design, vidéo de présentation IA', 'UI design, AI concept video'),
        tools: 'Figma, Runway, Kling',
      }}
      intro={t(
        <>
          <p>
            Shu Uemura voulait aider ses clientes à choisir et à appliquer leurs produits, avec
            un coach personnel sur leur téléphone.
          </p>
          <p>
            J&apos;ai conçu tous les écrans, en échange direct avec le client, sur trois
            itérations. Elles ont porté sur trois points : mieux montrer le savoir-faire de la
            marque, adapter vraiment les conseils au visage de chaque cliente, et choisir les
            décors (des mannequins IA devant du béton, dans l&apos;esprit de Tokyo).
          </p>
          <p>
            J&apos;ai aussi réalisé une vidéo en IA pour présenter le concept au CEO de Shu
            Uemura, avant le développement. Le concept a été bien reçu et le projet a été livré.
          </p>
        </>,
        <>
          <p>
            Shu Uemura wanted to help its clients choose and apply their products, with a
            personal coach on their phone.
          </p>
          <p>
            I designed every screen, working directly with the client over three iterations.
            They focused on three things: showing the brand&apos;s craft more clearly, fitting
            the advice to each client&apos;s face, and choosing the settings (AI models against
            concrete, in a Tokyo spirit).
          </p>
          <p>
            I also made an AI video to present the concept to Shu Uemura&apos;s CEO before
            development. The concept was well received and the project was delivered.
          </p>
        </>
      )}
    >
      {steps.map((step, i) => (
        <div key={step.n}>
          <Chapter n={i + 1} title={step.title}>
            <p>{step.text}</p>
          </Chapter>
          <Row cols={2} mobileCols={2} className="max-w-3xl mx-auto">
            {step.screens.map((s) => (
              <Media key={s.src} src={s.src} alt={s.alt} width={390} height={844} priority={i === 0} />
            ))}
          </Row>
        </div>
      ))}

      <Chapter n={5} title={t('Prolonger en boutique', 'Continue in store')}>
        <p>
          {t(
            'À la fin, la cliente retrouve les produits utilisés et peut prendre rendez-vous avec un maquilleur en boutique.',
            'At the end, the client sees the products used and can book an in-store make-up artist.'
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
      <Chapter n={6} title={t('Itérations', 'Iterations')} lede={t('Trois versions, de l’appli générique à l’appli Shu Uemura.', 'Three versions, from a generic app to a Shu Uemura one.')}>
        <p>
          {t(
            'Le premier jet posait les bases fonctionnelles : un compte, une galerie de demandes et un chat texte neutre. La V1 installe l’univers de marque (rouge Shu Uemura, choix d’un mentor, analyse faciale) mais reste générique. La version finale s’appuie sur le savoir-faire de la maison : les mesures du visage propres à Shu Uemura, les décors en béton et des tutoriels liés aux produits.',
            'The first draft laid the functional groundwork: an account, a request gallery and a neutral text chat. V1 brought in the brand world (Shu Uemura red, mentor choice, face analysis) but stayed generic. The final version builds on the house’s craft: Shu Uemura’s own face measurements, concrete settings and product-linked tutorials.'
          )}
        </p>
      </Chapter>
      <div className="max-w-3xl mx-auto space-y-3">
        <span className="block text-[13px] text-black/45">{t('Premier jet', 'First draft')}</span>
        <Row cols={3} mobileCols={2}>
          <Media src="/shu-draft-login.png" alt={t('Shu Uemura — premier jet, connexion', 'Shu Uemura — first draft, login')} width={390} height={844} />
          <Media src="/shu-draft-requests.png" alt={t('Shu Uemura — premier jet, galerie de demandes', 'Shu Uemura — first draft, request gallery')} width={390} height={844} />
          <Media src="/shu-draft-chat.png" alt={t('Shu Uemura — premier jet, chat', 'Shu Uemura — first draft, chat')} width={390} height={844} className="hidden md:block" />
        </Row>
      </div>
      <div className="max-w-3xl mx-auto space-y-3 pt-6">
        <span className="block text-[13px] text-black/45">V1</span>
        <Row cols={3} mobileCols={2}>
          <Media src="/shu-v1-cover.png" alt={t('Shu Uemura — V1, accueil', 'Shu Uemura — V1, welcome')} width={390} height={844} />
          <Media src="/shu-v1-mentor.png" alt={t('Shu Uemura — V1, choix du mentor', 'Shu Uemura — V1, mentor choice')} width={390} height={844} />
          <Media src="/shu-v1-facemesh.png" alt={t('Shu Uemura — V1, analyse faciale', 'Shu Uemura — V1, face analysis')} width={390} height={844} className="hidden md:block" />
        </Row>
      </div>

      {/* STORYBOARD */}
      <Chapter n={7} title={t('Le film de présentation', 'The concept film')}>
        <p>
          {t(
            'Pour présenter le concept avant le développement, j’ai écrit et réalisé un film en IA, montré au CEO de Shu Uemura. Il part du geste d’un maquilleur de la maison et arrive aux mentors virtuels.',
            'To present the concept before development, I wrote and made an AI film, shown to Shu Uemura’s CEO. It starts from a house make-up artist’s gesture and ends with the virtual mentors.'
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
            <figcaption className="text-xs text-black/50">
              <span className="text-black/45 tabular-nums">0{f.n} — </span>
              {t(f.fr, f.en)}
            </figcaption>
          </figure>
        ))}
      </Row>
    </ProjectPage>
  );
}
