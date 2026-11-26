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
      'Fond blanc, texte petit, navigation dans les coins de l’écran. Ce sont les photos qui guident l’œil.',
      'White page, small type, navigation in the corners of the screen. The photos lead the eye.'
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
      'La boutique reste simple à lire. La chimère et le film de la collection sont regroupés à deux endroits précis.',
      'The shop stays easy to read. The collection’s chimera and film are kept to two specific places.'
    ),
  },
];

export default function Page() {
  const t = useT();

  return (
    <ProjectPage
      title="Soutrame"
      subtitle={t('Le site e-commerce de ma marque de vêtements', 'The e-commerce site for my clothing label')}
      lede={t(
        'La boutique en ligne de ma marque, faite seul et presque sans budget, pour vendre une première capsule en précommande.',
        'My label’s online shop, built on my own with almost no budget, to sell a first capsule on pre-order.'
      )}
      meta={{
        year: '2026',
        context: t('Projet personnel, en ligne', 'Personal project, live'),
        role: t('Direction artistique, retouche photo, UX/UI, motion, intégration', 'Art direction, photo retouching, UX/UI, motion, front-end'),
        tools: 'Figma, Midjourney, Next.js, Claude',
      }}
      hero={
        <>
      <Media src="/soutrame-case/campaign.jpg" alt={t('Soutrame — ouverture du site', 'Soutrame — site opening')} width={2400} height={1500} priority />
          <p className="text-[13px] text-black/50 pt-2">
            <Link href="/soutrame" className="underline underline-offset-2 hover:text-black">
              soutrame.com
            </Link>{' '}
            — {t('le site est en ligne.', 'the site is live.')}
          </p>
        </>
      }
      intro={t(
        <>
          <p>Soutrame est ma marque de vêtements. Pour sa première capsule, Chimera School, il fallait une vraie boutique, pas une vitrine, pour une marque inconnue et un budget proche de zéro. J&apos;ai tout mené seul, de la retouche des photos à la mise en ligne.</p>
        </>,
        <>
          <p>Soutrame is my clothing label. Its first capsule, Chimera School, needed a real shop, not a showcase, for an unknown brand on a near-zero budget. I led everything on my own, from photo retouching to launch.</p>
        </>
      )}
    >
      {/* CONSTRAINTS */}
      <Chapter n={1} title={t('Les contraintes', 'The constraints')} lede={t('Pas de page blanche : quatre limites très concrètes, et chaque choix du site en découle.', 'No blank page: four very concrete limits, and every choice on the site follows from them.')}>
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
      <Chapter n={2} title={t('Rendre les photos vendables', 'Making the photos sell')}>
        <p>
          {t('Avant de dessiner le site, j’ai retravaillé les photos du shooting : fond uniformisé, matériel effacé, format 4:5, modèle détouré avec une ombre au sol.', 'Before designing the site, I reworked the shoot photos: even background, gear removed, 4:5 format, model cut out with a floor shadow.')}
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
      <Chapter n={3} title={t('La direction', 'The direction')}>
        <p>
          {t('Je suis parti des boutiques de marques indépendantes qui vendent sans en faire trop : j’ai repris leur organisation, pas leur style.', 'I started from independent label shops that sell without overdoing it: I took their structure, not their style.')}
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
      <Chapter n={4} title={t('Itérations', 'Iterations')}>
        <p>
          {t('La première version mettait l’univers au premier plan : grands titres, neige animée, fond beige. En la testant, un problème est apparu : on ne savait pas ce qui était à vendre.', 'The first version put the universe first: big titles, animated snow, beige background. Testing it, one problem showed up: you couldn’t tell what was for sale.')}
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
          {t('Une vraie boutique : une phrase dit ce qu’on vend, chaque carte cadre la pièce et montre la tenue au survol. Le pantalon passe du long au short : on comprend sans lire qu’il se transforme.', 'A real shop: one line says what is sold, each card frames the piece and shows the outfit on hover. The trousers switch from long to shorts: you get that they convert without reading.')}
        </p>
        <p>
          {t('Les grands titres et la neige ont disparu ; la chimère n’occupe plus qu’un seul chapitre.', 'The big titles and the snow are gone; the chimera now lives in a single chapter.')}
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
      <Chapter n={5} title={t('Le parcours d’achat', 'The purchase flow')}>
        <p>
          {t('La fiche produit reprend les codes d’une boutique : photos qui défilent à gauche, achat fixe à droite, et l’autre pièce de l’ensemble proposée en dessous.', 'The product page follows shop conventions: photos scrolling on the left, purchase fixed on the right, and the other piece of the set offered below.')}
        </p>
        <p>
          {t('Tant que le paiement n’est pas ouvert, le bouton affiche « Bientôt disponible » : le parcours est complet, sans promettre une commande impossible.', 'Until payment opens, the button reads “Coming soon”: the flow is complete, without promising an impossible order.')}
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
      <Chapter n={6} title={t('Le mouvement', 'Motion')}>
        <p>
          {t('Le site s’ouvre sur un court film noir et blanc, généré avec Midjourney puis monté et étalonné. Il est montré à sa taille réelle, comme une projection, plutôt qu’étiré.', 'The site opens on a short black-and-white film, generated with Midjourney then edited and graded. It is shown at its real size, like a projection, rather than stretched.')}
        </p>
        <p>
          {t('À l’ouverture, le logo prend une matière liquide. Le mouvement reste réservé à ces moments ; la grille, elle, ne bouge pas.', 'On opening, the logo turns liquid. Motion is kept for those moments; the grid itself never moves.')}
        </p>
      </Chapter>
      <Row cols={2} align="center">
        <Media src="/soutrame-case/film.jpg" alt={t('Film d’ouverture', 'Opening film')} width={2400} height={1500} />
        <Media src="/soutrame-case/loader.jpg" alt={t('Le logo en matière liquide', 'The logo in a liquid material')} width={1000} height={640} />
      </Row>

      {/* MOBILE */}
      <Chapter n={7} title={t('Sur mobile', 'On mobile')}>
        <p>
          {t('Les visiteurs arrivent d’Instagram, donc sur téléphone : une colonne, les photos au doigt, la capsule en lecture verticale.', 'Visitors come from Instagram, so on a phone: one column, photos by swipe, the capsule read vertically.')}
        </p>
      </Chapter>
      <Row cols={4} mobileCols={2} align="end">
        <Media src="/soutrame-case/m-campaign.jpg" alt={t('Mobile — ouverture', 'Mobile — opening')} width={900} height={1948} />
        <Media src="/soutrame-case/m-shop.jpg" alt={t('Mobile — boutique', 'Mobile — shop')} width={900} height={1948} />
        <Media src="/soutrame-case/m-sheet.jpg" alt={t('Mobile — fiche produit', 'Mobile — product page')} width={900} height={1948} />
        <Media src="/soutrame-case/m-capsule.jpg" alt={t('Mobile — capsule', 'Mobile — capsule')} width={900} height={1948} />
      </Row>

      {/* UNIVERSE */}
      <Chapter n={8} title={t('La chimère', 'The chimera')}>
        <p>
          {t('La chimère brodée devient un visuel en nacre, dans un seul chapitre noir. C’est la seule couleur du site.', 'The embroidered chimera becomes a mother-of-pearl visual, in a single black chapter. It is the only colour on the site.')}
        </p>
      </Chapter>
      <Media src="/soutrame-case/capsule.jpg" alt={t('Chapitre Chimera School', 'Chimera School chapter')} width={2400} height={1500} />

      {/* NEXT */}
      <Chapter n={9} title={t('La suite', 'What’s next')}>
        <p>
          {t('Le site est en ligne sur soutrame.com. Prochaine étape : ouvrir le paiement et les précommandes.', 'The site is live at soutrame.com. Next step: open payment and pre-orders.')}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
