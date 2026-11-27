'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Strip } from './Kit';
import { useT } from '@/components/i18n';
import Header from '@/components/Header';
import NextProject from '@/components/dot/NextProject';
import DotIn from '@/components/dot/DotIn';
import { CaseHead, Chapter, Media, Summary } from '@/components/project/ProjectPage';
import HoloCard from './HoloCard';
import Constellation from './Constellation';
import Story from './Story';

type T = <V,>(fr: V, en: V) => V;

const problems = (t: T) => [
  {
    when: t('Une collection', 'One collection'),
    title: t('Une appli par jeu', 'One app per game'),
    text: t(
      'Pokémon, One Piece et Yu-Gi-Oh! ont chacun leur appli et leurs prix. On ne voit jamais toute sa collection au même endroit.',
      'Pokémon, One Piece and Yu-Gi-Oh! each have their own app and prices. You never see the whole collection in one place.'
    ),
  },
  {
    when: t('Une valeur', 'One value'),
    title: t('Le prix du marché, mais pas le mien', 'The market price, but not mine'),
    text: t(
      'Les outils affichent la cote d’une carte. Pas ce que j’ai payé en yens ou en yuans, ni l’écart avec aujourd’hui.',
      'Tools show a card’s market price. Not what I paid in yen or yuan, or the gap with today.'
    ),
  },
  {
    when: t('Une revente', 'One sale'),
    title: t('Le gain, frais compris', 'The gain, fees included'),
    text: t(
      'Avec les frais de plateforme, l’envoi et le change, je ne sais pas combien je gagne vraiment en revendant.',
      'With platform fees, shipping and exchange rates, I can’t tell how much I really make when I sell.'
    ),
  },
];

const principles = (t: T) => [
  { n: '01', title: t('La carte au centre', 'The card at the centre'), text: t('La carte est grande et éclairée. L’interface reste discrète autour.', 'The card is large and lit. The interface stays discreet around it.') },
  { n: '02', title: t('Un chiffre par écran', 'One figure per screen'), text: t('Chaque écran met en avant un seul chiffre : la valeur, le gain ou l’écart.', 'Each screen puts one figure forward: the value, the gain or the gap.') },
  { n: '03', title: t('Des points pour les données', 'Dots for data'), text: t('Les courbes et la collection sont dessinées en points, comme l’illustration de la carte.', 'Curves and the collection are drawn in dots, like the card’s illustration.') },
  { n: '04', title: t('Le gain net', 'The net gain'), text: t('Le prix payé est converti au taux du jour d’achat. À la revente, l’appli retire les frais et l’envoi avant d’afficher un gain.', 'The price paid is converted at the rate of the purchase day. When selling, the app takes off fees and shipping before showing a gain.') },
];

const moments = (t: T) => [
  { n: '01', title: t('Ajouter', 'Add'), text: t('Je scanne la carte en boutique et je note le prix payé, dans la devise de l’achat.', 'I scan the card in the shop and note the price paid, in the currency of the purchase.') },
  { n: '02', title: t('Suivre', 'Follow'), text: t('Toute la collection au même endroit. On trie par jeu, par langue ou par valeur.', 'The whole collection in one place. You sort by game, language or value.') },
  { n: '03', title: t('Vendre', 'Sell'), text: t('L’appli retire les frais, l’envoi et le change, puis affiche le gain net avant que je décide.', 'The app takes off fees, shipping and exchange, then shows the net gain before I decide.') },
];

const flow = (t: T) => [
  { k: t('Découvrir', 'Discover'), items: [['accueil', t('Accueil', 'Home')], ['constellation', t('Constellation', 'Constellation')]] },
  { k: t('Ajouter', 'Add'), items: [['scan', t('Scan', 'Scan')], ['ajout', t('Prix d’achat', 'Purchase price')]] },
  { k: t('Comprendre', 'Understand'), items: [['fiche', t('Fiche carte', 'Card page')], ['marches', t('Marchés', 'Markets')]] },
  { k: t('Suivre', 'Follow'), items: [['collection', t('Collection', 'Collection')], ['evolution', t('Évolution', 'Evolution')], ['repartition', t('Répartition', 'Breakdown')], ['alertes', t('Alertes', 'Alerts')]] },
  { k: t('Collectionner', 'Collect'), items: [['serie', t('Série', 'Set')], ['radar', t('Radar', 'Radar')], ['vitrine', t('Vitrine', 'Showcase')], ['voyage', t('Voyage', 'Trip')]] },
  { k: t('Vendre', 'Sell'), items: [['vendre', t('Revente', 'Sale')]] },
];

const hooks = (t: T) => [
  { f: 'serie', n: t('Compléter une série', 'Complete a set'), text: t('Chaque carte possédée allume un point. On voit ce qu’il manque et ce que ça coûterait.', 'Each card you own lights a dot. You see what is missing and what it would cost.') },
  { f: 'radar', n: t('Voir ce qui monte', 'See what is going up'), text: t('Le radar liste les cartes dont le prix monte, jeu par jeu, avec un bouton pour les ajouter aux souhaits.', 'The radar lists the cards whose price is going up, game by game, with a button to add them to a wishlist.') },
  { f: 'vitrine', n: t('Montrer ses plus belles cartes', 'Show your best cards'), text: t('On choisit trois cartes et on partage sa vitrine.', 'You pick three cards and share your showcase.') },
];


/** A short note beside what follows, inside a chapter. */
function Beat({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-10 md:h-16" aria-hidden />
      <p className="fine-note font-medium">{children}</p>
    </>
  );
}

export default function Page() {
  const t = useT();
  const pathname = usePathname();

  const meta: [string, string][] = [
    [t('Année', 'Year'), '2026'],
    [t('Contexte', 'Context'), t('Projet personnel, concept', 'Personal project, concept')],
    [t('Rôle', 'Role'), t('Concept, UX/UI, direction artistique, 3D', 'Concept, UX/UI, art direction, 3D')],
    [t('Outils', 'Tools'), 'Figma, Blender, Claude'],
  ];
  const screens = flow(t).flatMap((g) => g.items.map(([f, name]) => ({ src: `/foil/p/${f}.webp`, name, group: g.k })));
  const item = (title: string, text: string) => (
    <p key={title}>
      <span className="text-[#0a0a0a]">{title}.</span> {text}
    </p>
  );

  return (
    <main className="relative block min-h-screen w-full overflow-x-clip bg-white font-sans text-[#0a0a0a] [scroll-snap-type:none]">
      <Header crumb="Foil" />

      <div className="px-2 pt-24 md:px-3 md:pt-[24vh]">
        <CaseHead
          title="Foil"
          subtitle={t('2026 — Concept d’app iOS, collection de cartes', '2026 — iOS app concept, card collection')}
          lede={t('Une appli pour suivre ma collection de cartes et savoir ce que je gagnerais en les revendant.', 'An app to track my card collection and see what I would make by selling it.')}
          intro={
            <>
              <p>
                {t(
                  'Foil est un concept d’application iOS. On y range ses cartes Pokémon, One Piece ou Yu-Gi-Oh!, avec ce qu’on a payé et ce qu’elles valent aujourd’hui.',
                  'Foil is a concept iOS app. You keep your Pokémon, One Piece or Yu-Gi-Oh! cards in it, with what you paid and what they are worth today.'
                )}
              </p>
              <p>
                {t(
                  'Je pars de mon cas : j’achète des cartes en Chine et au Japon pour les garder plusieurs années, puis les revendre en Europe. Je n’ai pas trouvé d’outil qui garde le prix payé en yuans ou en yens à côté de la valeur actuelle.',
                  'I started from my own case: I buy cards in China and Japan to keep for several years, then sell in Europe. I haven’t found a tool that keeps the price paid in yuan or yen next to the current value.'
                )}
              </p>
            </>
          }
          rows={meta}
        />

        <div className="fine-flow mt-16 md:mt-24">
          <Media
            className="fine-open"
            priority
            src="/foil/hero-v2.jpg"
            width={2880}
            height={1620}
            alt={t('Gros plan d’un iPhone tenu en main, sur l’écran évolution de Foil : plus 718 euros', 'Close-up of an iPhone held in hand, on Foil’s growth screen: plus 718 euros')}
          />
          <div className="mt-8">
            <Summary
              items={[
                { k: t('Le problème', 'The problem'), v: t('Suivre ses cartes, c’est plusieurs applis et plusieurs devises. Aucun outil ne garde le prix payé en yuans ou en yens à côté de la valeur actuelle.', 'Tracking cards means several apps and several currencies. No tool keeps the price paid in yuan or yen next to the current value.') },
                { k: t('Ce que j’ai conçu', 'What I designed'), v: t('Une appli iOS : une seule collection pour tous les jeux, et pour chaque carte ce qu’elle vaut et l’écart avec le prix payé.', 'An iOS app: one collection for every game, and for each card what it is worth and the gap with the price paid.') },
                { k: t('Le parti pris', 'The stance'), v: t('La carte reste au centre, éclairée comme un objet : une appli qui ne montre que de l’argent, on finit par ne plus l’ouvrir.', 'The card stays at the centre, lit like an object: an app that only shows money ends up unopened.') },
              ]}
            />
          </div>
        </div>

        <div className="fine-flow mt-4">
          {/* 01 — the problem */}
          <Chapter n={1} title={t('Le problème', 'The problem')} lede={t('Suivre ses cartes aujourd’hui, c’est plusieurs applis et plusieurs devises.', 'Tracking cards today means several apps and several currencies.')}>
            {problems(t).map((p) => item(p.title, p.text))}
          </Chapter>
          <Media src="/foil/duo-v4.jpg" width={2880} height={1800} alt={t('L’accueil de l’application et la fiche d’une carte, sur iPhone', 'The app’s home screen and a card page, on iPhone')} caption={t('L’accueil et la fiche d’une carte.', 'The home screen and a card page.')} />

          {/* 02 — the concept */}
          <Chapter n={2} title={t('Le concept', 'The concept')} lede={t('Une seule collection pour tous les jeux. Chaque carte affiche ce qu’elle vaut et l’écart avec ce que j’ai payé.', 'One collection for every game. Each card shows what it is worth and the gap with what I paid.')}>
            {moments(t).map((m) => item(m.title, m.text))}
          </Chapter>
          <Media src="/foil/collection-main.jpg" width={2400} height={960} alt={t('Une main tient l’iPhone, à contre-jour, sur l’écran Collection : des cartes de trois jeux', 'A hand holds the iPhone against the light, on the Collection screen: cards from three games')} caption={t('Une seule collection, trois jeux.', 'One collection, three games.')} />

          {/* 03 — the product */}
          <Chapter n={3} title={t('Le produit', 'The product')} lede={t('La carte reste au centre de l’écran. Je l’ai éclairée comme un objet : son reflet bouge avec le doigt.', 'The card stays at the centre of the screen. I lit it like an object: its reflection moves with your finger.')} />
          <div className="fine-r">
            <p className="pb-2 text-black/55">{t('Touche la carte', 'Touch the card')} →</p>
            <HoloCard />
          </div>
          <Beat>{t('Toute la collection sur un écran : un point par carte, regroupés par jeu. Plus une carte vaut cher, plus son point est gros.', 'The whole collection on one screen: one dot per card, grouped by game. The more a card is worth, the bigger its dot.')}</Beat>
          <div className="fine-r">
            <Constellation />
          </div>
          <Beat>{t('Un exemple : j’achète une carte à Tokyo et je la revends trois ans plus tard.', 'An example: I buy a card in Tokyo and sell it three years later.')}</Beat>
          <div className="fine-r">
            <Story />
          </div>
          <div className="mt-12">
            <div className="mb-3 text-black/55">{t('Choix de design', 'Design choices')}</div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-3">
              {principles(t).map((p) => (
                <div key={p.n} className="border-t border-black/15 pt-2">
                  <div className="text-black/55">{p.n}</div>
                  <div className="mt-1 font-medium">{p.title}</div>
                  <p className="mt-1 text-black/70">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 04 — the screens */}
          <Chapter n={4} title={t('Quinze écrans', 'Fifteen screens')} lede={t('Le parcours complet, de la découverte à la revente.', 'The full journey, from discovery to resale.')} />
          <div className="fine-bleed">
            <Strip items={screens} label={t('Les écrans', 'The screens')} />
          </div>
          <div className="h-6" aria-hidden />
          <Media video src="/motion/foil-rows.mp4" width={1920} height={1080} alt={t('Animation : les quinze écrans défilent sur deux rails, en points loin du centre et nets au milieu', 'Animation: the fifteen screens slide on two rails, in dots away from the centre and sharp in the middle')} />
        <Media src="/foil/scan-main.jpg" width={2400} height={1350} alt={t('Un doigt touche la carte reconnue sur l’écran Scan, à contre-jour', 'A finger taps the recognised card on the Scan screen, against the light')} caption={t('Cadrer une carte pour l’ajouter.', 'Frame a card to add it.')} />

        {/* 05 — desire */}
        <Chapter n={5} title={t('Donner envie', 'Desire')} lede={t('Une appli qui ne montre que de l’argent, on finit par ne plus l’ouvrir. J’ai ajouté trois choses pour y revenir.', 'An app that only shows money ends up unopened. I added three things to bring people back.')}>
          {hooks(t).map((h) => item(h.n, h.text))}
        </Chapter>
        <div className="grid grid-cols-3 gap-1">
          {hooks(t).map((h) => (
            <figure key={h.f}>
              <DotIn className="bg-[#0b0c0e]">
                <div className="flex justify-center px-[12%] pt-[10%]">
                  <Image unoptimized src={`/foil/p/${h.f}.webp`} alt={h.n} width={780} height={1688} sizes="(min-width:768px) 16vw, 30vw" className="h-auto w-full rounded-t-[6%]" />
                </div>
              </DotIn>
              <figcaption className="pt-1.5 text-black/55">{h.n}</figcaption>
            </figure>
          ))}
        </div>

        {/* 06 — notes */}
        <Chapter n={6} title={t('Avec du recul', 'Looking back')}>
          <p>
            {t(
              'Les valeurs affichées sont des chiffres de démonstration, pas de vrais prix. Une vraie version aurait besoin d’une source de prix et d’un taux de change fiables. Les cartes Pokémon, One Piece et Yu-Gi-Oh! appartiennent à leurs ayants droit. Les cartes dessinées en points sont les miennes.',
              'The values shown are demonstration figures, not real prices. A real version would need a reliable price source and exchange rate. The Pokémon, One Piece and Yu-Gi-Oh! cards belong to their rights holders. The dotted cards are mine.'
            )}
          </p>
          <p>
            {t(
              'La suite : montrer le concept à d’autres collectionneurs et leur demander comment ils décident d’acheter ou de vendre. Ensuite, prototyper le scan.',
              'Next: show the concept to other collectors and ask how they decide to buy or sell. Then prototype the scan.'
            )}
          </p>
        </Chapter>
        </div>
      </div>

      <NextProject path={pathname} />
    </main>
  );
}
