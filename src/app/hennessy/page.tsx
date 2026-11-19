'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="Hennessy X.O Second Skin"
      subtitle={t('Art génératif & UI, avec OKCC', 'Generative art & UI, with OKCC')}
      lede={t(
        'Une tablette où chaque visiteur choisit les couleurs de sa bouteille. L’œuvre est générée sur place, puis imprimée.',
        'A tablet where each visitor picks the colours of their bottle. The artwork is generated on the spot, then printed.'
      )}
      meta={{
        year: '2025',
        context: t('OKCC — présenté à VivaTech 2025', 'OKCC — shown at VivaTech 2025'),
        role: t('Visuels 3D, UI de la tablette de vente', '3D visuals, sales tablet UI'),
        tools: 'Figma, Blender, After Effects',
        award: 'Lovie Award — Best Experience Art Direction',
      }}
      intro={t(
        <>
          <p>
            Second Skin est une édition limitée du Hennessy X.O, faite avec l&apos;artiste
            génératif Florian Zumbrunn. Chaque bouteille reçoit une « seconde peau » créée par ses
            algorithmes, et un numéro de série : aucune n&apos;est identique.
          </p>
          <p>
            Chez OKCC, j&apos;ai fait les visuels 3D des bouteilles sous Blender et l&apos;UI de
            la tablette de vente du château, où les visiteurs personnalisent leur édition. Le
            projet a reçu un Lovie Award.
          </p>
        </>,
        <>
          <p>
            Second Skin is a limited edition of Hennessy X.O, made with generative artist
            Florian Zumbrunn. Each bottle gets a “second skin” created by his algorithms, and a
            serial number: no two are the same.
          </p>
          <p>
            At OKCC, I made the 3D bottle visuals in Blender and the UI of the sales tablet at
            the château, where visitors personalise their edition. The project won a Lovie Award.
          </p>
        </>
      )}
    >
      <Media src="/hennessy.webp" alt={t('Hennessy X.O Second Skin — rendu 3D', 'Hennessy X.O Second Skin — 3D render')} width={3000} height={1688} priority />

      <Chapter n={1} title={t('Le parcours tablette', 'The tablet journey')}>
        <p>
          {t(
            'Le visiteur choisit une couleur dominante puis une couleur secondaire, l’œuvre est générée en direct, et il valide sa création avant impression de la seconde peau.',
            'Visitors pick a dominant colour, then a secondary one; the artwork is generated live, and they approve their creation before the second skin is printed.'
          )}
        </p>
      </Chapter>
      <Media src="/hennessy1.webp" alt={t('Hennessy — écran d’accueil de la tablette', 'Hennessy — tablet welcome screen')} width={1366} height={1024} />
      <Row cols={2}>
        <Media src="/hennessy2.png" alt={t('Hennessy — choix de la couleur dominante', 'Hennessy — dominant colour')} width={1366} height={1024} />
        <Media src="/hennessy3.png" alt={t('Hennessy — choix de la couleur secondaire', 'Hennessy — secondary colour')} width={1366} height={1024} />
      </Row>
      <Row cols={2}>
        <Media src="/hennessy4.webp" alt={t('Hennessy — génération de l’œuvre', 'Hennessy — artwork generation')} width={1366} height={1024} />
        <Media src="/hennessy5.png" alt={t('Hennessy — validation de la création', 'Hennessy — approving the creation')} width={1366} height={1024} />
      </Row>
      <Media src="/hennessy6.png" alt={t('Hennessy — écran de remerciement', 'Hennessy — thank-you screen')} width={1366} height={1024} />

      <Chapter n={2} title={t('Le choix des couleurs', 'Choosing colours')} lede={t('Tout repose sur le choix des couleurs. J’ai testé quatre façons de le faire.', 'Everything hinges on choosing colours. I tested four ways of doing it.')}>
        <p>
          {t(
            'C’est ce choix qui rend chaque bouteille différente. Avant d’arriver au parcours final en deux temps, couleur dominante puis secondaire, j’ai comparé ces pistes.',
            'This choice is what makes each bottle different. Before settling on the final two-step flow, dominant colour then secondary, I compared these options.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        {[
          {
            n: 1,
            src: '/hen-explo-1-palettes.png',
            fr: 'Palettes prédéfinies : rapide, mais le visiteur ne compose pas vraiment son œuvre.',
            en: 'Preset palettes: quick, but visitors don’t really compose their artwork.',
          },
          {
            n: 2,
            src: '/hen-explo-2-list.png',
            fr: 'Liste nommée : claire, mais longue à parcourir et la couleur passe après le texte.',
            en: 'Named list: clear, but long to scan, and the colour comes after the text.',
          },
          {
            n: 3,
            src: '/hen-explo-3-grid.png',
            fr: 'Grille de nuanciers : la couleur devient l’élément principal, tout est visible d’un coup.',
            en: 'Swatch grid: colour becomes the main element, everything is visible at once.',
          },
          {
            n: 4,
            src: '/hen-explo-4-carousel.png',
            fr: 'Carrousel : plus compact, mais il cache une partie des choix.',
            en: 'Carousel: more compact, but it hides part of the choice.',
          },
        ].map((v) => (
          <figure key={v.n} className="space-y-3">
            <Media src={v.src} alt={t(`Hennessy — exploration ${v.n}`, `Hennessy — exploration ${v.n}`)} width={1366} height={1024} />
            <figcaption className="text-xs text-black/50 leading-relaxed">
              <span className="text-black/45 tabular-nums">0{v.n} — </span>
              {t(v.fr, v.en)}
            </figcaption>
          </figure>
        ))}
      </Row>
      <p className="max-w-2xl text-sm text-black/70 leading-relaxed">
        {t(
          'La version finale garde la grille, plus lisible, mais remplace les aplats par des touches de peinture, plus proches du travail de Florian Zumbrunn. Le choix se fait en deux étapes pour que chacune reste simple.',
          'The final version keeps the grid, which reads best, but swaps flat swatches for paint strokes, closer to Florian Zumbrunn’s work. The choice happens in two steps so each one stays simple.'
        )}
      </p>
    </ProjectPage>
  );
}
