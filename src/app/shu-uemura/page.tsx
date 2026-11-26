'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { Bleed, Chap, Lede, Meta, Next, Principles, Title, WRAP } from '@/components/case/Kit';
import { Strip } from '@/app/foil/Kit';
import Compare from '@/components/colosse/Compare';
import '@/styles/globals.css';

/** A phone screen at its real ratio, with a thin rounded edge. */
function Phone({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[7%/3.3%] shadow-[0_24px_50px_-28px_rgba(0,0,0,.5)]" style={{ aspectRatio: '390/844' }}>
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes="(min-width:768px) 28vw, 45vw" className="object-cover" />
    </div>
  );
}

export default function Page() {
  const t = useT();

  const S = (f: string) => `/shu-flow-${f}.png`;
  const flow = [
    { src: S('01-cover'), group: t('Choisir son mentor', 'Choose a mentor'), name: t('L’accueil AI:tutor', 'The AI:tutor welcome') },
    { src: S('02-select-haruto'), group: t('Choisir son mentor', 'Choose a mentor'), name: t('Yoko, Ren ou Haruto', 'Yoko, Ren or Haruto') },
    { src: S('03-chat'), group: t('Échanger', 'Talk'), name: t('Quelques questions pour comprendre ce qu’elle veut', 'A few questions to understand what she wants') },
    { src: S('04-camera-cta'), group: t('Échanger', 'Talk'), name: t('Le mentor propose d’allumer la caméra', 'The mentor offers to turn on the camera') },
    { src: S('05-face-scan'), group: t('Analyser le visage', 'Read the face'), name: t('Les proportions du visage', 'The face’s proportions') },
    { src: S('06-brow-shape'), group: t('Analyser le visage', 'Read the face'), name: t('La forme de sourcil recommandée', 'The recommended brow shape') },
    { src: S('07-pencil'), group: t('Apprendre le geste', 'Learn the technique'), name: t('Le crayon, avec ses repères', 'The pencil, with its guides') },
    { src: S('08-flex-styler'), group: t('Apprendre le geste', 'Learn the technique'), name: t('Le flex styler', 'The flex styler') },
    { src: S('09-recommendations'), group: t('Prolonger en boutique', 'Continue in store'), name: t('Les produits utilisés, et un rendez-vous', 'The products used, and a booking') },
  ];

  const principles = [
    { k: t('Un mentor, pas un chatbot', 'A mentor, not a chatbot'), v: t('La cliente choisit son coach parmi Yoko, Ren et Haruto, chacun avec sa propre signature beauté.', 'The client picks her coach among Yoko, Ren and Haruto, each with a distinct beauty signature.') },
    { k: t('Le savoir-faire de la maison', 'The house’s craft'), v: t('Les mesures du visage propres à Shu Uemura, et à chaque étape le produit de la marque à utiliser.', 'Shu Uemura’s own face measurements, and at each step the brand product to use.') },
    { k: t('Jusqu’en boutique', 'All the way to the store'), v: t('À la fin, la cliente retrouve les produits utilisés et peut prendre rendez-vous avec un maquilleur.', 'At the end, the client sees the products used and can book a make-up artist.') },
  ];

  const film = [
    { n: 1, fr: 'La cliente choisit son mentor.', en: 'The client picks her mentor.' },
    { n: 2, fr: 'Le mentor apparaît et engage la conversation.', en: 'The mentor appears and starts the conversation.' },
    { n: 3, fr: 'Les mesures Shu Uemura se dessinent sur le visage.', en: 'Shu Uemura’s measurements are drawn on the face.' },
    { n: 4, fr: 'Les trois mentors accompagnent des milliers de clientes.', en: 'The three mentors guide thousands of clients.' },
  ];

  return (
    <main className="w-full min-h-screen bg-white text-[#0a0a0a] font-sans overflow-x-clip relative flex flex-col [scroll-snap-type:none]">
      <Header crumb="Shu Uemura AI:tutor" />

      <div className={`${WRAP} pt-28 md:pt-36`}>
        <Title title="Shu Uemura" kicker="AI:tutor" subtitle={t('2025 — UI design, coach beauté IA, avec OKCC', '2025 — UI design, AI beauty tutor, with OKCC')} />
      </div>

      <div className="mt-14 md:mt-20">
        <Bleed
          src="/shu-cover-v7.jpg"
          alt={t('Une main tient un pinceau Shu Uemura et l’iPhone, ouvert sur l’analyse du visage', 'A hand holds a Shu Uemura brush and the iPhone, open on the face analysis')}
          aspect="2400/1500"
          mobileAspect="4/5"
          position="50% 80%"
          priority
          bg="#ffffff"
        />
      </div>

      <div className={WRAP}>
        <Lede className="pt-20 md:pt-28">
          {t(
            'Un coach maquillage sur mobile, qui lit le visage de la cliente et lui montre le geste, produit par produit.',
            'A mobile make-up coach that reads the client’s face and shows her the technique, product by product.'
          )}
        </Lede>
        <Meta
          rows={[
            [t('Année', 'Year'), '2025'],
            [t('Contexte', 'Context'), 'OKCC'],
            [t('Rôle', 'Role'), t('UI design, film de présentation IA', 'UI design, AI concept film')],
            [t('Outils', 'Tools'), 'Figma, Runway, Kling'],
          ]}
        >
          <p>
            {t(
              'Shu Uemura voulait aider ses clientes à choisir et à appliquer leurs produits, avec un coach personnel sur leur téléphone.',
              'Shu Uemura wanted to help its clients choose and apply their products, with a personal coach on their phone.'
            )}
          </p>
          <p>
            {t(
              'J’ai conçu tous les écrans, en échange direct avec le client, sur trois itérations. J’ai aussi réalisé un film en IA pour présenter le concept au CEO de Shu Uemura, avant le développement. Le concept a été bien reçu et le projet a été livré.',
              'I designed every screen, working directly with the client over three iterations. I also made an AI film to present the concept to Shu Uemura’s CEO before development. The concept was well received and the project was delivered.'
            )}
          </p>
        </Meta>

        {/* 01 — JOURNEY */}
        <Chap
          n={1}
          title={t('Le parcours', 'The journey')}
          aside={t('9 écrans', '9 screens')}
          lede={t('Choisir un mentor, lui parler, se faire lire le visage, apprendre le geste.', 'Choose a mentor, talk to them, have your face read, learn the technique.')}
        >
          <p>
            {t(
              'Quelques questions dans un chat pour comprendre ce que veut la cliente, puis le mentor lui propose d’allumer la caméra. La suite se passe sur son propre visage.',
              'A few questions in a chat to understand what the client wants, then the mentor offers to turn on the camera. The rest happens on her own face.'
            )}
          </p>
        </Chap>
      </div>

      <Strip items={flow} label={t('Le parcours complet', 'The full journey')} hint={t('Faire glisser', 'Drag')} />

      <div className={WRAP}>
        {/* 02 — THE FACE */}
        <Chap
          n={2}
          title={t('Lire le visage', 'Reading the face')}
          lede={t('Le moment clé : l’appli mesure les proportions du visage, puis recommande la forme de sourcil qui lui va.', 'The key moment: the app measures the face’s proportions, then recommends the brow shape that suits it.')}
        >
          <p>
            {t(
              'Ensuite, un tutoriel étape par étape, avec des repères dessinés sur le visage et le produit Shu Uemura à utiliser à chaque fois.',
              'Then a step-by-step tutorial, with guides drawn on the face and the matching Shu Uemura product at each step.'
            )}
          </p>
        </Chap>
        <div className="bg-[#f2f1ee] px-4 py-10 md:px-[8%] md:py-16">
          <div className="grid grid-cols-3 gap-3 md:gap-8">
            {[
              { f: '05-face-scan', k: 'A', fr: 'Les mesures.', en: 'The measurements.', d: t('Les proportions du visage, relevées par la caméra.', 'The face’s proportions, read by the camera.') },
              { f: '06-brow-shape', k: 'B', fr: 'La forme.', en: 'The shape.', d: t('Une forme recommandée, et les autres à côté.', 'One recommended shape, the others next to it.') },
              { f: '07-pencil', k: 'C', fr: 'Le geste.', en: 'The technique.', d: t('Le produit en main, avec ses repères.', 'The product in hand, with its guides.') },
            ].map((s, i) => (
              <motion.figure key={s.f} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                <Phone src={S(s.f)} alt={`Shu Uemura — ${t(s.fr, s.en)}`} />
                <figcaption className="mt-3 hidden md:grid grid-cols-[22px_1fr] gap-x-2 text-[13px] leading-[1.45]">
                  <span className="text-black/45">{s.k}</span>
                  <span><span className="font-medium">{t(s.fr, s.en)}</span> <span className="text-black/60">{s.d}</span></span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* 03 — ITERATIONS */}
        <Chap
          n={3}
          title={t('Itérations', 'Iterations')}
          aside={t('3 versions', '3 versions')}
          lede={t('Trois versions, de l’appli générique à l’appli Shu Uemura.', 'Three versions, from a generic app to a Shu Uemura one.')}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 items-start">
          <div className="md:col-span-5 space-y-10 text-[15px] md:text-[17px] leading-[1.55]">
            <div className="border-t border-black/15 pt-3">
              <div className="text-[13px] text-black/45">{t('Premier jet', 'First draft')}</div>
              <p className="mt-2 text-black/75">{t('Les bases fonctionnelles : un compte, une galerie de demandes et un chat texte neutre.', 'The functional groundwork: an account, a request gallery and a neutral text chat.')}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 max-w-[320px] opacity-80">
                <Phone src="/shu-draft-login.png" alt={t('Premier jet, connexion', 'First draft, login')} />
                <Phone src="/shu-draft-requests.png" alt={t('Premier jet, galerie de demandes', 'First draft, request gallery')} />
                <Phone src="/shu-draft-chat.png" alt={t('Premier jet, chat', 'First draft, chat')} />
              </div>
            </div>
            <div className="border-t border-black/15 pt-3">
              <div className="text-[13px] text-black/45">V1</div>
              <p className="mt-2 text-black/75">{t('L’univers de marque arrive : le rouge Shu Uemura, le choix d’un mentor, l’analyse faciale. Mais ça reste générique.', 'The brand world arrives: Shu Uemura red, choosing a mentor, face analysis. But it stays generic.')}</p>
            </div>
            <div className="border-t-[3px] border-[#0a0a0a] pt-3">
              <div className="text-[13px] text-black/45">{t('Version finale', 'Final version')}</div>
              <p className="mt-2">{t('Elle s’appuie sur le savoir-faire de la maison : les mesures du visage propres à Shu Uemura, les décors en béton dans l’esprit de Tokyo, et des tutoriels liés aux produits.', 'It builds on the house’s craft: Shu Uemura’s own face measurements, concrete settings in a Tokyo spirit, and product-linked tutorials.')}</p>
            </div>
          </div>
          <div className="md:col-start-7 md:col-span-6">
            <div className="mx-auto max-w-[360px]">
              <Compare
                width={390}
                height={844}
                pairs={[
                  { name: t('Accueil', 'Welcome'), day: '/shu-v1-cover.png', night: S('01-cover'), alt: t('Accueil', 'Welcome') },
                  { name: t('Mentor', 'Mentor'), day: '/shu-v1-mentor.png', night: S('02-select-haruto'), alt: t('Choix du mentor', 'Choosing a mentor') },
                  { name: t('Visage', 'Face'), day: '/shu-v1-facemesh.png', night: S('05-face-scan'), alt: t('Analyse du visage', 'Face analysis') },
                ]}
                labels={{ left: 'V1', right: t('Finale', 'Final'), leftAlt: 'V1', rightAlt: t('version finale', 'final version'), aria: t('Comparer la V1 et la version finale', 'Compare V1 and the final version') }}
              />
            </div>
          </div>
        </div>
        <div className="mt-20 md:mt-28">
          <div className="text-[13px] text-black/45 mb-4">{t('Choix de design', 'Design choices')}</div>
          <Principles items={principles} />
        </div>

        {/* 04 — FILM */}
        <Chap
          n={4}
          title={t('Le film de présentation', 'The concept film')}
          lede={t('Avant le développement, un film en IA pour présenter le concept au CEO de Shu Uemura.', 'Before development, an AI film to present the concept to Shu Uemura’s CEO.')}
        >
          <p>
            {t(
              'Je l’ai écrit et réalisé. Il part du geste d’un maquilleur de la maison et arrive aux mentors virtuels.',
              'I wrote and made it. It starts from a house make-up artist’s gesture and ends with the virtual mentors.'
            )}
          </p>
        </Chap>
      </div>

      <div className="bg-[#0b0c0e] px-2 py-3 md:px-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {film.map((f, i) => (
            <motion.figure key={f.n} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.9, delay: i * 0.12 }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '540/292' }}>
                <Image src={`/shu-sb-${f.n}.jpg`} alt={t(`Film — ${f.fr}`, `Film — ${f.en}`)} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="pt-2 pb-3 text-[12px] leading-[1.4] text-white/60">
                <span className="text-white/35 tabular-nums">0{f.n} — </span>
                {t(f.fr, f.en)}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      <Next path="/shu-uemura" />
    </main>
  );
}
