'use client';

import Image from 'next/image';
import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';
import HoloCard from './HoloCard';
import Constellation from './Constellation';
import Story from './Story';

type T = <V,>(fr: V, en: V) => V;

const problems = (t: T) => [
  {
    when: t('Une collection', 'One collection'),
    title: t('Plusieurs jeux, plusieurs outils', 'Several games, several tools'),
    text: t(
      'Pokémon, One Piece, Yu-Gi-Oh! : chaque jeu a son application, sa base de prix, sa façon de classer. La collection est éclatée.',
      'Pokémon, One Piece, Yu-Gi-Oh!: each game has its own app, price base and way of sorting. The collection is scattered.'
    ),
  },
  {
    when: t('Une valeur', 'One value'),
    title: t('Un prix de marché sans mon prix d’achat', 'A market price without what I paid'),
    text: t(
      'Les outils donnent la cote d’une carte, pas le prix payé en yens ou en yuans ni l’écart réel avec aujourd’hui.',
      'Tools give a card’s market price, not what was paid in yen or yuan, nor the real gap with today.'
    ),
  },
  {
    when: t('Une revente', 'One sale'),
    title: t('Le gain réel, frais compris', 'The real gain, fees included'),
    text: t(
      'Frais de plateforme, envoi, change : la vraie question, « combien je gagne ? », reste sans réponse.',
      'Platform fees, shipping, exchange: the real question, “how much do I make?”, goes unanswered.'
    ),
  },
];

const principles = (t: T) => [
  { n: '01', title: t('La carte est le héros', 'The card is the hero'), text: t('Tout s’organise autour de la carte : grande, éclairée, avec son reflet. L’interface reste en retrait.', 'Everything is organised around the card: large, lit, with its reflection. The interface stays in the background.') },
  { n: '02', title: t('Une donnée par écran', 'One figure per screen'), text: t('Chaque écran répond à une seule question et affiche un chiffre dominant : la valeur, le gain, l’écart.', 'Each screen answers a single question and shows one dominant figure: value, gain, gap.') },
  { n: '03', title: t('La donnée se dessine', 'Data is drawn'), text: t('Courbes, répartitions et collection entière sont tracées en points, comme l’illustration de la carte.', 'Curves, breakdowns and the whole collection are drawn in dots, like the card’s illustration.') },
  { n: '04', title: t('Toujours le gain réel', 'Always the real gain'), text: t('Le prix payé est converti au taux du jour d’achat, et la revente retire frais et envoi avant d’afficher un gain.', 'The price paid is converted at the purchase-day rate, and a sale subtracts fees and shipping before showing a gain.') },
];

const moments = (t: T) => [
  { n: '01', title: t('Ajouter', 'Add'), text: t('Un scan en boutique : la carte est reconnue, on note le prix payé dans sa devise.', 'One scan in the shop: the card is recognised, the price paid is noted in its own currency.') },
  { n: '02', title: t('Suivre', 'Follow'), text: t('Toute la collection au même endroit, triée par jeu, langue ou valeur, avec l’écart au prix payé.', 'The whole collection in one place, sorted by game, language or value, with the gap to the price paid.') },
  { n: '03', title: t('Vendre', 'Sell'), text: t('Le gain net, une fois les frais, l’envoi et le change retirés, avant de décider.', 'The net gain, once fees, shipping and exchange are taken off, before deciding.') },
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
  { f: 'serie', n: t('Compléter une série', 'Complete a set'), text: t('Chaque carte possédée allume un point. Voir la série se remplir donne envie de chasser la suivante, avec son coût estimé.', 'Each owned card lights a dot. Watching the set fill up makes you want to hunt the next one, with its estimated cost.') },
  { f: 'radar', n: t('Repérer ce qui monte', 'Spot what is rising'), text: t('Le radar montre les cartes qui progressent, jeu par jeu, avec une courbe en points et un bouton pour les ajouter aux souhaits.', 'The radar shows rising cards, game by game, with a dotted curve and a button to add them to a wishlist.') },
  { f: 'vitrine', n: t('Montrer ses plus belles pièces', 'Show off your best pieces'), text: t('La vitrine met en scène les trois cartes dont on est le plus fier, prête à être partagée.', 'The showcase stages the three cards you are proudest of, ready to share.') },
];

export default function Page() {
  const t = useT();

  return (
    <ProjectPage
      title="Écrin"
      subtitle={t(
        'Toute une collection de cartes, sa valeur de marché et son vrai gain, au même endroit. Concept iOS.',
        'A whole card collection, its market value and its real gain, in one place. An iOS concept.'
      )}
      meta={{
        year: '2026',
        context: t('Projet personnel, concept', 'Personal project, concept'),
        role: t('Concept, UX/UI, direction artistique, 3D', 'Concept, UX/UI, art direction, 3D'),
        tools: 'Figma, Blender, Claude',
      }}
      intro={t(
        <>
          <p>
            Écrin est un concept d&apos;application iOS pour suivre une collection de cartes à collectionner,
            tous jeux confondus, avec la valeur de marché de chaque carte et ce que l&apos;on gagnerait
            vraiment en la revendant.
          </p>
          <p>
            Le point de départ est personnel : je constitue moi-même un portefeuille de cartes achetées en
            Chine et au Japon, à garder plusieurs années avant de les revendre en Europe. Aucun outil ne
            relie le prix payé dans une autre devise, la valeur actuelle et le gain réel.
          </p>
        </>,
        <>
          <p>
            Écrin is a concept iOS app for tracking a trading-card collection, across games, with the market
            value of each card and what you would really make by selling it.
          </p>
          <p>
            The starting point is personal: I am building a portfolio of cards bought in China and Japan, to
            keep for several years before selling in Europe. No tool links the price paid in another
            currency, the current value and the real gain.
          </p>
        </>
      )}
    >
      <Media
        src="/ecrin/hero.jpg"
        alt={t(
          'Rendu 3D d’une carte holographique sous trois angles de lumière : le reflet change avec l’angle',
          '3D render of a holographic card under three light angles: the reflection changes with the angle'
        )}
        width={1700}
        height={956}
        priority
      />

      <Chapter title={t('Le problème', 'The problem')}>
        <p>
          {t(
            'Collectionner et investir dans des cartes demande de jongler entre plusieurs applications, plusieurs devises et plusieurs façons de classer.',
            'Collecting and investing in cards means juggling several apps, several currencies and several ways of sorting.'
          )}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {problems(t).map((p) => (
          <div key={p.title} className="bg-white p-6 md:p-8 space-y-4">
            <span className="text-[13px] text-black/45">{p.when}</span>
            <h4 className="text-xl font-medium tracking-[-0.03em] leading-tight">{p.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      <Chapter title={t('Le concept', 'The concept')}>
        <p>
          {t(
            'Une seule collection pour tous les jeux, que l’on trie par jeu, série, langue ou valeur. Chaque carte affiche sa valeur de marché et son écart avec le prix payé.',
            'A single collection for every game, sorted by game, series, language or value. Each card shows its market value and its gap with the price paid.'
          )}
        </p>
        <p>
          {t(
            'Trois moments structurent l’application : ajouter, suivre, vendre. Entre les deux, tout ce qui donne envie de continuer.',
            'Three moments structure the app: add, follow, sell. In between, everything that makes you want to keep going.'
          )}
        </p>
      </Chapter>
      <Media
        src="/ecrin/duo.jpg"
        alt={t('Rendu 3D : une carte holographique à côté de l’accueil de l’application sur iPhone', '3D render: a holographic card next to the app’s home screen on iPhone')}
        width={1700}
        height={1062}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {moments(t).map((m) => (
          <div key={m.n} className="bg-white p-6 md:p-8 space-y-4">
            <span className="text-[13px] text-black/45">{m.n}</span>
            <h4 className="text-xl font-medium tracking-[-0.03em]">{m.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      <Media
        src="/ecrin/collection.jpg"
        alt={t(
          'Rendu 3D de cinq cartes de trois jeux différents, côte à côte : Pokémon, One Piece, Yu-Gi-Oh!',
          '3D render of five cards from three different games side by side: Pokémon, One Piece, Yu-Gi-Oh!'
        )}
        width={2000}
        height={800}
      />
      <Chapter title={t('Touche la carte', 'Touch the card')}>
        <p>
          {t(
            'La carte est le héros de l’application. Elle est éclairée comme un objet, et son reflet holographique suit le mouvement, comme dans la main.',
            'The card is the hero of the app. It is lit like an object, and its holographic reflection follows the movement, as in the hand.'
          )}
        </p>
      </Chapter>
      <HoloCard />

      <Chapter title={t('Une carte du ciel', 'A map of the sky')}>
        <p>
          {t(
            'Une collection entière tient dans un seul regard : un point par carte, regroupés par jeu, la taille du point suit la valeur.',
            'A whole collection fits in a single glance: one dot per card, grouped by game, the size of the dot follows the value.'
          )}
        </p>
      </Chapter>
      <Constellation />

      <Chapter title={t('Quatre principes', 'Four principles')}>
        <p>
          {t(
            'Quatre règles tiennent l’ensemble des écrans, du scan à la revente.',
            'Four rules hold every screen together, from scan to sale.'
          )}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/15 border border-black/15">
        {principles(t).map((m) => (
          <div key={m.n} className="bg-white p-6 md:p-8 space-y-4">
            <span className="text-[13px] text-black/45">{m.n}</span>
            <h4 className="text-lg font-medium tracking-[-0.03em] leading-tight">{m.title}</h4>
            <p className="text-sm text-black/60 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      <Chapter title={t('Une journée à Tokyo', 'A day in Tokyo')}>
        <p>
          {t(
            'Un scénario pour suivre l’application de bout en bout : du comptoir d’une boutique jusqu’à la revente, trois ans plus tard.',
            'A scenario to follow the app from end to end: from a shop counter to the sale, three years later.'
          )}
        </p>
      </Chapter>
      <Story />

      <Chapter title={t('Quinze écrans', 'Fifteen screens')}>
        <p>
          {t(
            'Le parcours complet, en six temps : découvrir, ajouter, comprendre, suivre, collectionner, vendre.',
            'The full journey, in six steps: discover, add, understand, follow, collect, sell.'
          )}
        </p>
      </Chapter>
      <Media
        src="/ecrin/lineup.jpg"
        alt={t('Rendu 3D de cinq iPhone : constellation, accueil, fiche carte, série, vitrine', '3D render of five iPhones: constellation, home, card page, set, showcase')}
        width={1700}
        height={956}
      />
      <div className="bg-[#08090b] text-white border border-black/15 overflow-hidden">
        <div className="flex gap-px overflow-x-auto snap-x snap-mandatory pb-6" style={{ scrollbarWidth: 'thin' }}>
          {flow(t).flatMap((g) => g.items.map(([f, name], k) => ({ f, name, g: k === 0 ? g.k : '' }))).map((p) => (
            <figure key={p.f} className="snap-start shrink-0 w-[62vw] md:w-[260px] p-5 md:p-6 space-y-3">
              <span className="block h-4 text-[12px] tracking-[0.08em] uppercase text-white/45">{p.g}</span>
              <Image
                src={`/ecrin/p/${p.f}.webp`}
                alt={t(`Écran iPhone : ${p.name}`, `iPhone screen: ${p.name}`)}
                width={780}
                height={1688}
                sizes="(max-width: 768px) 62vw, 260px"
                className="w-full h-auto block rounded-[26px] border border-white/15"
              />
              <figcaption className="text-[13px] text-white/60">{p.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Chapter title={t('Donner envie de collectionner', 'Making you want to collect')}>
        <p>
          {t(
            'Un outil de suivi finit par se vider si seule la valeur compte. Trois mécaniques gardent l’envie de continuer.',
            'A tracking tool empties out if only value matters. Three mechanics keep the desire to continue.'
          )}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {hooks(t).map((h) => (
          <div key={h.f} className="bg-[#0c0d0f] text-white">
            <Image
              src={`/ecrin/p/${h.f}.webp`}
              alt={h.n}
              width={780}
              height={1688}
              sizes="(max-width: 768px) 100vw, 420px"
              className="w-full h-auto block"
            />
            <div className="p-6 space-y-2">
              <h4 className="text-lg font-medium tracking-[-0.03em]">{h.n}</h4>
              <p className="text-sm text-white/60 leading-relaxed">{h.text}</p>
            </div>
          </div>
        ))}
      </div>

      <Chapter title={t('Données et illustrations', 'Data and artwork')}>
        <p>
          {t(
            'Les valeurs de marché affichées sont des chiffres de démonstration, pas des prix réels : une version réelle demanderait une source de prix et un taux de change fiables.',
            'The market values shown are demonstration figures, not real prices: a real version would need a reliable price source and exchange rate.'
          )}
        </p>
        <p>
          {t(
            'Les cartes Pokémon, One Piece et Yu-Gi-Oh! sont utilisées à titre d’illustration du produit et appartiennent à leurs ayants droit respectifs. Les cartes dessinées en points sont des créations originales.',
            'The Pokémon, One Piece and Yu-Gi-Oh! cards are used to illustrate the product and belong to their respective rights holders. The dotted cards are original creations.'
          )}
        </p>
      </Chapter>

      <Chapter title={t('La suite', 'What’s next')}>
        <p>
          {t(
            'Prochaine étape : confronter le concept à d’autres collectionneurs, pour vérifier que le tri par jeu, la complétion de série et le gain net répondent à leur façon de décider, puis prototyper le scan.',
            'Next step: putting the concept in front of other collectors, to check that sorting by game, set completion and net gain match how they decide, then prototyping the scan.'
          )}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
