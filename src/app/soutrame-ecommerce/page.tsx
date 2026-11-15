'use client';

import Link from 'next/link';
import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

type T = <V,>(fr: V, en: V) => V;

const constraints = (t: T) => [
  {
    title: t('Pas de budget plateforme', 'No platform budget'),
    text: t('Pas de Shopify ni de thème payant : un site sur mesure, hébergé avec le portfolio.', 'No Shopify, no paid theme: a custom site, hosted alongside the portfolio.'),
  },
  {
    title: t('Une seule séance photo', 'A single shoot'),
    text: t('Un modèle, un fond de studio, un ensemble. Tout le site devait tenir sur ces images.', 'One model, one studio backdrop, one set. The whole site had to hold on those images.'),
  },
  {
    title: t('Une marque inconnue', 'An unknown brand'),
    text: t('Les premiers clients arrivent d’Instagram, sur mobile, et doivent comprendre en quelques secondes.', 'First customers arrive from Instagram, on mobile, and have to understand within seconds.'),
  },
  {
    title: t('Vendre avant de produire', 'Sell before producing'),
    text: t('Précommande en petite série : le site doit vendre une pièce qui n’existe pas encore en stock.', 'Small-run pre-order: the site has to sell a piece that isn’t in stock yet.'),
  },
];

const decisions = (t: T) => [
  {
    title: t('Le vêtement d’abord', 'The garment first'),
    text: t(
      'Fond blanc, typo petite et en minuscules, navigation dans les coins de l’écran. Les photos portent la hiérarchie, l’interface s’efface.',
      'White page, small sentence-case type, navigation in the corners of the screen. The photographs carry the hierarchy; the interface steps back.'
    ),
  },
  {
    title: t('Une signature : la trame', 'One signature: the weave'),
    text: t(
      'SOUTRAME vient de « trame ». Les images apparaissent bande par bande, comme un tissage, et les boutons se remplissent de la même façon.',
      'SOUTRAME comes from “trame”, the weft. Images appear strip by strip, like weaving, and buttons fill in the same way.'
    ),
  },
  {
    title: t('Un chapitre pour l’univers', 'One chapter for the universe'),
    text: t(
      'La boutique reste claire et lisible. L’univers de la collection, la chimère et le film, est regroupé à des endroits précis plutôt que partout.',
      'The shop stays light and legible. The collection’s universe, the chimera and the film, is kept to specific places rather than spread everywhere.'
    ),
  },
];

export default function Page() {
  const t = useT();

  return (
    <ProjectPage
      title="Soutrame"
      subtitle={t('Le site e-commerce de ma marque de vêtements', 'The e-commerce site for my clothing label')}
      meta={{
        year: '2026',
        context: t('Projet personnel, en ligne', 'Personal project, live'),
        role: t('Direction artistique, retouche photo, UX/UI, motion, intégration', 'Art direction, photo retouching, UX/UI, motion, front-end'),
        tools: 'Figma, Midjourney, Next.js, Claude',
      }}
      intro={t(
        <>
          <p>
            Soutrame est ma marque de vêtements. Sa première capsule, Chimera School, est un ensemble
            en deux pièces : une veste de survêtement courte et un pantalon dont les jambes se
            détachent.
          </p>
          <p>
            Il fallait un site pour la vendre. Pas une page vitrine, une vraie boutique : comprendre
            ce qu&apos;on achète, choisir sa pièce, précommander. Avec une contrainte de taille : une
            marque que personne ne connaît encore, et un budget proche de zéro.
          </p>
          <p>
            J&apos;ai tout mené seul, de la retouche des photos du shooting à la mise en ligne, en
            utilisant l&apos;IA comme outil de production pour le film d&apos;intro et le
            développement.
          </p>
        </>,
        <>
          <p>
            Soutrame is my clothing label. Its first capsule, Chimera School, is a two-piece set: a
            cropped track jacket and trousers whose legs zip off.
          </p>
          <p>
            It needed a site to sell it. Not a showcase page, a real shop: understand what you are
            buying, choose your piece, pre-order. With one big constraint: a brand nobody knows yet,
            and a budget close to zero.
          </p>
          <p>
            I led everything on my own, from retouching the shoot to going live, using AI as a
            production tool for the intro film and the development.
          </p>
        </>
      )}
    >
      <Media src="/soutrame-case/campaign.jpg" alt={t('Soutrame — ouverture du site', 'Soutrame — site opening')} width={2400} height={1500} priority />
      <p className="text-[13px] text-black/50 pt-2">
        <Link href="/soutrame" className="underline underline-offset-2 hover:text-black">
          soutrame.com
        </Link>{' '}
        — {t('le site est en ligne.', 'the site is live.')}
      </p>

      {/* CONSTRAINTS */}
      <Chapter title={t('Les contraintes', 'The constraints')}>
        <p>
          {t(
            'Le point de départ n’était pas une page blanche, mais quatre limites très concrètes. Chaque choix du site en découle.',
            'The starting point wasn’t a blank page but four very concrete limits. Every choice on the site follows from them.'
          )}
        </p>
      </Chapter>
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/15 border border-black/15">
        {constraints(t).map((c, i) => (
          <li key={c.title} className="bg-white p-5 md:p-6 space-y-2">
            <span className="text-[13px] text-black/45">0{i + 1}</span>
            <h4 className="text-[13px] font-medium">{c.title}</h4>
            <p className="text-xs text-black/50 leading-relaxed">{c.text}</p>
          </li>
        ))}
      </ol>

      {/* PHOTOGRAPHY */}
      <Chapter title={t('Rendre les photos vendables', 'Making the photos sell')}>
        <p>
          {t(
            'Les photos du shooting avaient un fond inégal, une teinte jaune et les pieds de lumière dans le cadre. Avant de dessiner le site, je les ai retravaillées : fond uniformisé et neutre, matériel de studio effacé, format 4:5 pour les fiches produit, puis modèle détouré sur un fond propre avec une ombre au sol.',
            'The shoot photos had an uneven backdrop, a yellow cast and light stands in frame. Before designing the site, I reworked them: an even, neutral backdrop, studio gear removed, a 4:5 format for product pages, then the model cut out onto a clean ground with a floor shadow.'
          )}
        </p>
        <p>
          {t(
            'Le site prend ensuite exactement la couleur de ce fond : les photos s’y fondent, et seul le vêtement ressort.',
            'The site then takes on exactly the colour of that backdrop: the photographs melt into it, and only the garment stands out.'
          )}
        </p>
      </Chapter>
      <Media src="/soutrame-case/retouch.jpg" alt={t('Avant et après retouche', 'Before and after retouching')} width={2400} height={534} />

      {/* DIRECTION */}
      <Chapter title={t('La direction', 'The direction')}>
        <p>
          {t(
            'Je suis parti des boutiques des marques indépendantes que j’admire, pour une raison simple : elles vendent sans jamais crier. J’en ai gardé la logique, pas l’apparence, et j’ai ajouté ce qui n’appartient qu’à Soutrame.',
            'I started from the shops of independent labels I admire, for a simple reason: they sell without ever shouting. I kept their logic, not their look, and added what belongs only to Soutrame.'
          )}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {decisions(t).map((d, i) => (
          <div key={d.title} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <span className="text-[13px] text-black/45">
              {t('Choix', 'Choice')} 0{i + 1}
            </span>
            <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug">{d.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{d.text}</p>
          </div>
        ))}
      </div>

      {/* ITERATIONS */}
      <Chapter title={t('Itérations', 'Iterations')}>
        <p>
          {t(
            'La première version mettait l’univers au premier plan : grands titres, neige animée partout, fond beige. En la testant, un problème est vite apparu : on ne savait pas ce qu’on regardait. La campagne, la veste ou l’ensemble ? Toutes les photos montraient la même tenue portée.',
            'The first version put the universe up front: big titles, animated snow everywhere, a beige background. Testing it, one problem came up fast: you couldn’t tell what you were looking at. The campaign, the jacket or the set? Every photo showed the same outfit, worn.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        <div className="space-y-2">
          <Media src="/soutrame-case/v1-hero.jpg" alt={t('Version 1 — ouverture', 'Version 1 — opening')} width={1440} height={900} />
          <span className="block text-[13px] text-black/45">{t('V1 — ouverture', 'V1 — opening')}</span>
        </div>
        <div className="space-y-2">
          <Media src="/soutrame-case/v1-shop.jpg" alt={t('Version 1 — boutique', 'Version 1 — shop')} width={1440} height={900} />
          <span className="block text-[13px] text-black/45">{t('V1 — boutique', 'V1 — shop')}</span>
        </div>
      </Row>
      <Chapter title={t('Ce qui a changé', 'What changed')}>
        <p>
          {t(
            'Une vraie section boutique, avec une phrase qui dit ce qu’on vend : la veste et le pantalon, séparément ou en ensemble. Chaque carte montre une photo recadrée sur la pièce vendue, et la tenue complète apparaît au survol. Le pantalon passe de la version longue à la version short : on comprend sans lire qu’il se transforme.',
            'A real shop section, with one line saying what is for sale: the jacket and the trousers, separately or as a set. Each card shows a photo cropped onto the piece for sale, with the full outfit on hover. The trousers switch from long to shorts: you understand they convert without reading a word.'
          )}
        </p>
        <p>
          {t(
            'Les grands titres ont disparu au profit d’une seule petite ligne, et la neige a été remplacée par le visuel de la chimère, cantonné à un seul chapitre.',
            'The big titles gave way to a single small line, and the snow was replaced by the chimera visual, kept to a single chapter.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        <div className="space-y-2">
          <Media src="/soutrame-case/shop.jpg" alt={t('Version finale — boutique', 'Final version — shop')} width={2400} height={1500} />
          <span className="block text-[13px] text-black/45">{t('Boutique', 'Shop')}</span>
        </div>
        <div className="space-y-2">
          <Media src="/soutrame-case/shop_hover.jpg" alt={t('Version finale — survol d’une pièce', 'Final version — hovering a piece')} width={2400} height={1500} />
          <span className="block text-[13px] text-black/45">{t('Au survol, la pièce portée', 'On hover, the piece worn')}</span>
        </div>
      </Row>

      {/* PURCHASE FLOW */}
      <Chapter title={t('Le parcours d’achat', 'The purchase flow')}>
        <p>
          {t(
            'La fiche produit reprend les codes d’une boutique : les photos défilent à gauche, les informations d’achat restent fixes à droite. Taille, prix, description, guide des tailles et conditions de précommande sont au même endroit. Une section « Compléter la silhouette » propose l’autre pièce de l’ensemble.',
            'The product page follows shop conventions: photos scroll on the left, buying information stays pinned on the right. Size, price, description, size guide and pre-order terms sit in one place. A “Complete the look” section offers the other piece of the set.'
          )}
        </p>
        <p>
          {t(
            'Tant que le paiement n’est pas ouvert, le bouton affiche « Bientôt disponible » et les tailles restent visibles mais inactives. Le parcours est complet et testable, sans jamais promettre une commande impossible.',
            'Until payment opens, the button reads “Coming soon” and sizes stay visible but inactive. The flow is complete and testable without ever promising an order that can’t go through.'
          )}
        </p>
      </Chapter>
      <Media src="/soutrame-case/flow.jpg" alt={t('Parcours d’achat, d’Instagram à la précommande', 'Purchase journey, from Instagram to pre-order')} width={2400} height={825} />
      <div className="pt-6" />
      <Media src="/soutrame-case/sheet.jpg" alt={t('Fiche produit', 'Product page')} width={2400} height={1500} />
      <Row cols={2}>
        <div className="space-y-2">
          <Media src="/soutrame-case/bag.jpg" alt={t('Panier vide', 'Empty bag')} width={2400} height={1500} />
          <span className="block text-[13px] text-black/45">{t('Le panier vide redirige vers Instagram pour être prévenu du drop', 'The empty bag points to Instagram to hear about the drop')}</span>
        </div>
        <div className="space-y-2">
          <Media src="/soutrame-case/lookbook.jpg" alt={t('Lookbook', 'Lookbook')} width={2400} height={1500} />
          <span className="block text-[13px] text-black/45">{t('Le lookbook, une bande d’images à faire glisser', 'The lookbook, a strip of images to drag')}</span>
        </div>
      </Row>

      {/* MOTION */}
      <Chapter title={t('Le mouvement', 'Motion')}>
        <p>
          {t(
            'Le site s’ouvre sur un court film en noir et blanc : un cocon, un papillon qui en sort, des fils tissés, le tissu de la veste. Les plans ont été générés avec Midjourney, puis montés et étalonnés. Leur définition étant faible, le film est présenté à sa taille réelle, comme une projection, plutôt qu’étiré en plein écran.',
            'The site opens on a short black-and-white film: a cocoon, a moth emerging, woven threads, the jacket’s fabric. The shots were generated with Midjourney, then edited and graded. Since their resolution is low, the film is shown at its real size, like a projection, rather than stretched full screen.'
          )}
        </p>
        <p>
          {t(
            'Le logo, une grappe de cercles, prend une matière liquide à l’ouverture du site et d’une pièce : les satellites se détachent du cercle central, et un point parcourt la grappe. Le mouvement reste réservé à ces moments ; la grille, elle, ne bouge pas.',
            'The logo, a cluster of circles, takes on a liquid material when the site and a piece open: the satellites peel away from the central circle, and a dot travels round the cluster. Motion is kept to these moments; the grid itself stays still.'
          )}
        </p>
      </Chapter>
      <Row cols={2} align="center">
        <Media src="/soutrame-case/film.jpg" alt={t('Film d’ouverture', 'Opening film')} width={2400} height={1500} />
        <Media src="/soutrame-case/loader.jpg" alt={t('Le logo en matière liquide', 'The logo in a liquid material')} width={1000} height={640} />
      </Row>

      {/* MOBILE */}
      <Chapter title={t('Mobile d’abord, en pratique', 'Mobile first, in practice')}>
        <p>
          {t(
            'Les visiteurs arrivent d’Instagram, donc sur téléphone. Sur mobile, la navigation garde les mêmes coins, les cartes passent sur une colonne, les photos d’une fiche se font défiler au doigt et le chapitre de la capsule repasse en lecture verticale.',
            'Visitors come from Instagram, so on their phones. On mobile, navigation keeps the same corners, cards drop to a single column, product photos swipe sideways and the capsule chapter switches to a vertical read.'
          )}
        </p>
      </Chapter>
      <Row cols={4} mobileCols={2} align="end">
        <Media src="/soutrame-case/m-campaign.jpg" alt={t('Mobile — ouverture', 'Mobile — opening')} width={900} height={1948} />
        <Media src="/soutrame-case/m-shop.jpg" alt={t('Mobile — boutique', 'Mobile — shop')} width={900} height={1948} />
        <Media src="/soutrame-case/m-sheet.jpg" alt={t('Mobile — fiche produit', 'Mobile — product page')} width={900} height={1948} />
        <Media src="/soutrame-case/m-capsule.jpg" alt={t('Mobile — capsule', 'Mobile — capsule')} width={900} height={1948} />
      </Row>

      {/* UNIVERSE */}
      <Chapter title={t('L’univers, à sa place', 'The universe, in its place')}>
        <p>
          {t(
            'La chimère brodée sur l’ensemble devient un visuel en nacre, présenté dans un seul chapitre noir aux côtés d’une courte note de collection. C’est la seule couleur du site, et elle n’apparaît qu’une fois.',
            'The chimera embroidered on the set becomes a mother-of-pearl visual, shown in a single black chapter next to a short collection note. It is the only colour on the site, and it appears only once.'
          )}
        </p>
      </Chapter>
      <Media src="/soutrame-case/capsule.jpg" alt={t('Chapitre Chimera School', 'Chimera School chapter')} width={2400} height={1500} />

      {/* NEXT */}
      <Chapter title={t('Et maintenant', 'What’s next')}>
        <p>
          {t(
            'Le site est en ligne sur soutrame.com. Prochaines étapes : brancher le paiement, publier les pages légales, et ouvrir les précommandes. Ce sont les premières commandes qui diront si les choix de ce site tiennent face à de vrais clients.',
            'The site is live at soutrame.com. Next steps: connect payment, publish the legal pages, and open pre-orders. The first orders will tell whether the choices on this site hold up with real customers.'
          )}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
