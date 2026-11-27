'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useT } from '@/components/i18n';
import { Bleed, Chap, Next, Principles, WRAP } from '@/components/case/Kit';
import { CaseHead, Summary } from '@/components/project/ProjectPage';
import TabletStrip from '@/components/hennessy/TabletStrip';
import SecondSkin from '@/components/hennessy/SecondSkin';
import '@/styles/globals.css';

export default function Page() {
  const t = useT();

  const screens = [
    { src: '/hennessy1.webp', n: '01', title: t('Accueil.', 'Welcome.'), text: t('La collection, l’artiste, et un seul bouton : « Créer mon œuvre ».', 'The collection, the artist, and a single button: “Create my artwork”.') },
    { src: '/hennessy2.png', n: '02', title: t('La couleur dominante.', 'The dominant colour.'), text: t('Douze couleurs, en touches de peinture, à côté de la bouteille.', 'Twelve colours, as paint strokes, next to the bottle.') },
    { src: '/hennessy3.png', n: '03', title: t('La couleur secondaire.', 'The secondary colour.'), text: t('La même grille, puis « Générer ma création ».', 'The same grid, then “Generate my artwork”.') },
    { src: '/hennessy4.webp', n: '04', title: t('La génération.', 'The generation.'), text: t('L’œuvre se dessine en direct, en plein écran.', 'The artwork draws itself live, full screen.') },
    { src: '/hennessy5.png', n: '05', title: t('La validation.', 'Approval.'), text: t('Valider l’œuvre sur la bouteille, ou en générer une nouvelle.', 'Approve the artwork on the bottle, or generate a new one.') },
    { src: '/hennessy6.png', n: '06', title: t('Merci.', 'Thank you.'), text: t('L’œuvre sera imprimée, et le bras robotisé peut commencer.', 'The artwork will be printed, and the robotic arm can begin.') },
  ];

  const explorations = [
    { n: 1, src: '/hen-explo-1-palettes.png', fr: 'Palettes prédéfinies : rapide, mais le visiteur ne compose pas vraiment son œuvre.', en: 'Preset palettes: quick, but visitors don’t really compose their artwork.' },
    { n: 2, src: '/hen-explo-2-list.png', fr: 'Liste nommée : claire, mais longue à parcourir, et la couleur passe après le texte.', en: 'Named list: clear, but long to scan, and the colour comes after the text.' },
    { n: 3, src: '/hen-explo-3-grid.png', fr: 'Grille de nuanciers : la couleur devient l’élément principal, tout est visible d’un coup.', en: 'Swatch grid: colour becomes the main element, everything is visible at once.', kept: true },
    { n: 4, src: '/hen-explo-4-carousel.png', fr: 'Carrousel : plus compact, mais il cache une partie des choix.', en: 'Carousel: more compact, but it hides part of the choice.' },
  ];

  const principles = [
    { k: t('La couleur d’abord', 'Colour first'), v: t('Dans la grille, la couleur est l’élément principal et tout se voit d’un coup. La liste faisait passer le texte avant, le carrousel cachait des choix.', 'In the grid, colour is the main element and everything is visible at once. The list put text first, the carousel hid options.') },
    { k: t('Un choix à la fois', 'One choice at a time'), v: t('Dominante, puis secondaire : deux étapes, pour que chacune reste simple, debout devant une tablette.', 'Dominant, then secondary: two steps, so each one stays simple, standing in front of a tablet.') },
    { k: t('De la peinture, pas des aplats', 'Paint, not flat chips'), v: t('Les nuanciers deviennent des touches de peinture, plus proches du travail de Florian Zumbrunn.', 'The swatches become paint strokes, closer to Florian Zumbrunn’s work.') },
  ];

  return (
    <main className="w-full min-h-screen bg-white text-[#0a0a0a] font-sans overflow-x-clip relative flex flex-col [scroll-snap-type:none]">
      <Header crumb="Hennessy X.O Second Skin" />

      <div className="px-2 pt-24 md:px-3 md:pt-[24vh]">
        <CaseHead
          title="Hennessy X.O"
          kicker="Second Skin"
          subtitle={t('2025 — Art génératif, UI et 3D, avec OKCC', '2025 — Generative art, UI and 3D, with OKCC')}
          lede={t(
            'Quarante carafes, quarante œuvres. Chaque visiteur choisit deux couleurs sur une tablette, l’œuvre se génère devant lui, puis un bras robotisé personnalise sa bouteille.',
            'Forty decanters, forty artworks. Each visitor picks two colours on a tablet, the artwork is generated in front of them, then a robotic arm customises their bottle.'
          )}
          intro={
            <>
          <p>
            {t(
              'Second Skin est une édition limitée du Hennessy X.O, faite avec l’artiste génératif Florian Zumbrunn. Chaque bouteille reçoit une « seconde peau » créée par ses algorithmes, et un numéro de série : aucune n’est identique.',
              'Second Skin is a limited edition of Hennessy X.O, made with generative artist Florian Zumbrunn. Each bottle gets a “second skin” created by his algorithms, and a serial number: no two are the same.'
            )}
          </p>
          <p>
            {t(
              'Chez OKCC, j’ai fait les visuels 3D des bouteilles sous Blender et l’UI de la tablette de vente du château, où les visiteurs personnalisent leur édition.',
              'At OKCC, I made the 3D bottle visuals in Blender and the UI of the sales tablet at the château, where visitors personalise their edition.'
            )}
          </p>
            </>
          }
          rows={[
            [t('Année', 'Year'), '2025'],
            [t('Contexte', 'Context'), t('OKCC — présenté à VivaTech 2025', 'OKCC — shown at VivaTech 2025')],
            [t('Rôle', 'Role'), t('Visuels 3D, UI de la tablette de vente', '3D visuals, sales tablet UI')],
            [t('Outils', 'Tools'), 'Figma, Blender, After Effects'],
            [t('Distinction', 'Award'), 'Lovie Award — Best Experience Art Direction'],
          ]}
        />
      </div>

      <div className="mt-16 md:mt-24">
        <Bleed
          src="/hennessy.webp"
          alt={t('Rendu 3D : un bras robotisé personnalise la seconde peau d’une bouteille Hennessy X.O', '3D render: a robotic arm customises the second skin of a Hennessy X.O bottle')}
          aspect="3000/1688"
          mobileAspect="4/5"
          position="42% 50%"
          priority
          caption={t('Rendu 3D, Blender. Le bras robotisé personnalise la seconde peau.', '3D render, Blender. The robotic arm customises the second skin.')}
        />
      </div>

      <div className={WRAP}>
        <div className="mt-8">
          <Summary
            items={[
              { k: t('Le contexte', 'The context'), v: t('Une édition limitée du Hennessy X.O avec l’artiste génératif Florian Zumbrunn : quarante carafes, chacune avec sa seconde peau et son numéro.', 'A limited edition of Hennessy X.O with generative artist Florian Zumbrunn: forty decanters, each with its second skin and its number.') },
              { k: t('Ce que j’ai conçu', 'What I designed'), v: t('Les visuels 3D des bouteilles sous Blender et l’UI de la tablette de vente du château, où chaque visiteur choisit deux couleurs.', 'The 3D bottle visuals in Blender and the UI of the château’s sales tablet, where each visitor picks two colours.') },
              { k: t('Le parti pris', 'The stance'), v: t('La couleur d’abord, un choix à la fois : debout devant une tablette, chaque étape doit rester simple.', 'Colour first, one choice at a time: standing in front of a tablet, each step has to stay simple.') },
            ]}
          />
        </div>

        {/* 01 — JOURNEY */}
        <Chap
          n={1}
          title={t('Le parcours', 'The journey')}
          lede={t('Six écrans, et un seul vrai choix : deux couleurs.', 'Six screens, and only one real choice: two colours.')}
        >
          <p>
            {t(
              'Le visiteur choisit une couleur dominante puis une couleur secondaire. L’œuvre est générée en direct, il la valide, puis elle part à l’impression.',
              'Visitors pick a dominant colour, then a secondary one. The artwork is generated live, they approve it, then it goes to print.'
            )}
          </p>
        </Chap>
        <div className="fine-bleed">
          <TabletStrip items={screens} />
        </div>

        {/* 02 — COLOURS */}
        <Chap
          n={2}
          title={t('Le choix des couleurs', 'Choosing colours')}
          lede={t('C’est le choix des couleurs qui rend chaque bouteille unique. J’ai testé quatre façons de le faire.', 'Choosing colours is what makes each bottle unique. I tested four ways of doing it.')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6">
          {explorations.map((v) => (
            <motion.figure
              key={v.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (v.n % 2) * 0.08 }}
            >
              <div className={`relative overflow-hidden border ${v.kept ? 'border-[#0a0a0a]' : 'border-black/10'}`} style={{ aspectRatio: '1366/1024' }}>
                <Image src={v.src} alt={t(`Exploration ${v.n} du choix des couleurs`, `Colour choice exploration ${v.n}`)} fill sizes="(min-width:768px) 50vw, 100vw" className={`object-cover ${v.kept ? '' : 'grayscale-[35%] opacity-90'}`} />
                {v.kept && (
                  <span className="absolute left-3 top-3 bg-[#0a0a0a] px-2 py-1 text-[11px] tracking-[0.06em] uppercase text-white">{t('Retenue', 'Kept')}</span>
                )}
              </div>
              <figcaption className="mt-2 grid grid-cols-[28px_1fr] gap-x-2">
                <span className="text-black/45 tabular-nums">0{v.n}</span>
                <span className={v.kept ? '' : 'text-black/60'}>{t(v.fr, v.en)}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-6 max-w-[460px] text-black/70">
          {t(
            'La version finale garde la grille, plus lisible, mais remplace les aplats par des touches de peinture. Et le choix se fait en deux étapes, pour que chacune reste simple.',
            'The final version keeps the grid, which reads best, but swaps flat swatches for paint strokes. And the choice happens in two steps, so each one stays simple.'
          )}
        </p>
        <div className="mt-16">
          <div className="mb-3 text-black/45">{t('Choix de design', 'Design choices')}</div>
          <Principles items={principles} />
        </div>

        {/* 03 — TRY IT */}
        <Chap
          n={3}
          title={t('À toi', 'Your turn')}
          lede={t('Le parcours de la tablette, à refaire ici : deux couleurs, et ta seconde peau.', 'The tablet journey, to replay here: two colours, and your second skin.')}
        />
        <SecondSkin />

        {/* 04 — THE EDITION */}
        <Chap
          n={4}
          title={t('L’édition', 'The edition')}
          lede={t('40 carafes, chacune avec sa seconde peau et son numéro de série. Aucune n’est identique.', '40 decanters, each with its second skin and its serial number. No two are the same.')}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-[16vw] md:text-[4.6vw] leading-[0.85] tracking-[-0.05em] font-medium tabular-nums"
        >
          40
        </motion.div>
        <div className="mt-8 flex flex-col gap-1 border-t border-black/15 pt-2 md:flex-row md:items-baseline md:justify-between">
          <span className="text-black/45">{t('Distinction', 'Award')}</span>
          <span>Lovie Award — Best Experience Art Direction</span>
        </div>
      </div>

      <Next path="/hennessy" />
    </main>
  );
}
