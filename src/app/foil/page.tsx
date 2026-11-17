'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nextProject } from '@/components/projects';
import { Chrome, Plate, Reveal, Row, Strip, Weave, DISPLAY, TXT, usePhone } from './Kit';
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


function Lede({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <Reveal>
      <p className={`max-w-[900px] text-[28px] leading-[1.08] md:text-[52px] ${dark ? 'text-white' : ''}`} style={DISPLAY}>{children}</p>
    </Reveal>
  );
}

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`${TXT} pb-3 ${dark ? 'text-white/55' : 'text-black/50'}`}>{children}</p>;
}

export default function Page() {
  const t = useT();
  const phone = usePhone();
  const pathname = usePathname();
  const np = nextProject(pathname);

  const chapters = [
    { id: 'probleme', label: t('Le problème', 'The problem') },
    { id: 'concept', label: t('Le concept', 'The concept') },
    { id: 'produit', label: t('Le produit', 'The product') },
    { id: 'ecrans', label: t('Quinze écrans', 'Fifteen screens') },
    { id: 'envie', label: t('Donner envie', 'Desire') },
    { id: 'notes', label: t('Notes', 'Notes') },
  ];
  const meta = [
    [t('Année', 'Year'), '2026'],
    [t('Contexte', 'Context'), t('Projet personnel, concept', 'Personal project, concept')],
    [t('Rôle', 'Role'), t('Concept, UX/UI, direction artistique, 3D', 'Concept, UX/UI, art direction, 3D')],
    [t('Outils', 'Tools'), 'Figma, Blender, Claude'],
  ];
  const screens = flow(t).flatMap((g) => g.items.map(([f, name]) => ({ src: `/foil/p/${f}.webp`, name, group: g.k })));

  return (
    <div id="top" className="relative w-full overflow-x-clip bg-white font-sans text-[#0a0a0a]">
      <Chrome chapters={chapters} />

      {/* cover: one render, edge to edge */}
      <section className="relative h-[100svh] w-full bg-[#0b0c0e]">
        <Weave
          src={phone ? '/foil/cover.jpg' : '/foil/hero.jpg'}
          alt={t('Rendu 3D d’une carte holographique sous trois angles de lumière', '3D render of a holographic card under three light angles')}
          sizes="100vw"
          priority
          force
        />
      </section>

      {/* intro */}
      <section className="px-2 pb-28 pt-16 md:px-3 md:pb-40 md:pt-28">
        <Lede>
          {t(
            'Toute une collection de cartes, sa valeur de marché et son vrai gain, au même endroit.',
            'A whole card collection, its market value and its real gain, in one place.'
          )}
        </Lede>
        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-3">
          <dl className="grid grid-cols-2 content-start gap-x-3 gap-y-5 md:col-span-4 md:grid-cols-1">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className={`${TXT} text-black/45`}>{k}</dt>
                <dd className={TXT}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="max-w-[560px] space-y-4 text-[15px] leading-[1.5] md:col-span-5 md:col-start-8">
            <p>
              {t(
                'Foil est un concept d’application iOS pour suivre une collection de cartes, tous jeux confondus, avec la valeur de marché de chaque carte et ce que l’on gagnerait vraiment en la revendant.',
                'Foil is a concept iOS app for tracking a trading-card collection, across games, with the market value of each card and what you would really make by selling it.'
              )}
            </p>
            <p className="text-black/60">
              {t(
                'Le point de départ est personnel : je constitue moi-même un portefeuille de cartes achetées en Chine et au Japon, à garder plusieurs années avant de les revendre en Europe. Aucun outil ne relie le prix payé dans une autre devise, la valeur actuelle et le gain réel.',
                'The starting point is personal: I am building a portfolio of cards bought in China and Japan, to keep for several years before selling in Europe. No tool links the price paid in another currency, the current value and the real gain.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* the problem */}
      <section id="probleme" className="scroll-mt-8 px-2 pb-28 md:px-3 md:pb-40">
        <Label>01 → {t('Le problème', 'The problem')}</Label>
        <Lede>
          {t(
            'Collectionner et investir demande de jongler entre plusieurs applications, plusieurs devises et plusieurs façons de classer.',
            'Collecting and investing means juggling several apps, several currencies and several ways of sorting.'
          )}
        </Lede>
        <div className="mt-14 md:mt-20">
          {problems(t).map((p, i) => (
            <Row key={p.title} n={String(i + 1).padStart(2, '0')} title={p.title} text={p.text} />
          ))}
          <div className="border-t border-black/20" />
        </div>
      </section>

      <Plate
        src="/foil/duo.jpg"
        aspect="1700/1062" mobileAspect="1700/1062"
        alt={t('Rendu 3D : une carte holographique à côté de l’accueil de l’application sur iPhone', '3D render: a holographic card next to the app’s home screen on iPhone')}
        caption={t('La carte et son application : même objet, deux surfaces.', 'The card and its app: one object, two surfaces.')}
      />

      {/* the concept */}
      <section id="concept" className="scroll-mt-8 px-2 py-28 md:px-3 md:py-40">
        <Label>02 → {t('Le concept', 'The concept')}</Label>
        <Lede>
          {t(
            'Une seule collection pour tous les jeux, triée par jeu, série, langue ou valeur. Chaque carte affiche sa valeur et son écart avec le prix payé.',
            'A single collection for every game, sorted by game, series, language or value. Each card shows its value and its gap with the price paid.'
          )}
        </Lede>
        <div className="mt-14 md:mt-20">
          {moments(t).map((m) => (
            <Row key={m.n} n={m.n} title={m.title} text={m.text} />
          ))}
          <div className="border-t border-black/20" />
        </div>
      </section>

      <Plate
        src="/foil/collection.jpg"
        aspect="2000/800" mobileAspect="2000/800"
        alt={t('Rendu 3D de cinq cartes de trois jeux différents côte à côte', '3D render of five cards from three different games side by side')}
        caption={t('Pokémon, One Piece, Yu-Gi-Oh! : une seule étagère.', 'Pokémon, One Piece, Yu-Gi-Oh!: one shelf.')}
      />

      {/* the product: one dark chapter */}
      <section id="produit" className="scroll-mt-0 bg-[#08090b] px-2 py-28 text-white md:px-3 md:py-40">
        <Label dark>03 → {t('Le produit', 'The product')}</Label>
        <Lede dark>
          {t(
            'La carte est le héros. Elle est éclairée comme un objet, et son reflet suit le mouvement, comme dans la main.',
            'The card is the hero. It is lit like an object, and its reflection follows the movement, as in the hand.'
          )}
        </Lede>
        <div className="mt-14 md:mt-20">
          <p className={`${TXT} pb-2 text-white/55`}>{t('Touche la carte', 'Touch the card')} <span className="ml-2 text-white/35">{t('Bouge sur la carte', 'Move over the card')} →</span></p>
          <HoloCard />
        </div>
        <div className="mt-24 md:mt-40">
          <Lede dark>
            {t(
              'Toute la collection tient dans un regard : un point par carte, regroupés par jeu, la taille suit la valeur.',
              'The whole collection fits in a glance: one dot per card, grouped by game, size follows value.'
            )}
          </Lede>
          <p className={`${TXT} pb-2 pt-14 text-white/55 md:pt-20`}>{t('Une carte du ciel', 'A map of the sky')}</p>
          <Constellation />
        </div>
        <div className="mt-24 md:mt-40">
          <Lede dark>
            {t(
              'Une journée à Tokyo : du comptoir d’une boutique à la revente, trois ans plus tard.',
              'A day in Tokyo: from a shop counter to the sale, three years later.'
            )}
          </Lede>
          <p className={`${TXT} pb-2 pt-14 text-white/55 md:pt-20`}>{t('Scénario', 'Scenario')}</p>
          <Story />
        </div>
        <div className="mt-24 md:mt-40">
          <Label dark>{t('Quatre principes', 'Four principles')}</Label>
          {principles(t).map((p) => (
            <Row key={p.n} n={p.n} title={p.title} text={p.text} dark />
          ))}
          <div className="border-t border-white/20" />
        </div>
      </section>

      {/* the screens */}
      <section id="ecrans" className="scroll-mt-8 pt-28 md:pt-40">
        <div className="px-2 pb-14 md:px-3 md:pb-20">
          <Label>04 → {t('Quinze écrans', 'Fifteen screens')}</Label>
          <Lede>
            {t(
              'Le parcours complet en six temps : découvrir, ajouter, comprendre, suivre, collectionner, vendre.',
              'The full journey in six steps: discover, add, understand, follow, collect, sell.'
            )}
          </Lede>
        </div>
        <Plate
          src="/foil/lineup.jpg"
          aspect="1700/956" mobileAspect="1700/956"
          alt={t('Rendu 3D de cinq iPhone : constellation, accueil, fiche carte, série, vitrine', '3D render of five iPhones: constellation, home, card page, set, showcase')}
        />
        <div className="mt-1">
          <Strip items={screens} label={t('Les écrans', 'The screens')} hint={t('Faire glisser', 'Drag')} />
        </div>
      </section>

      {/* desire */}
      <section id="envie" className="scroll-mt-8 px-2 py-28 md:px-3 md:py-40">
        <Label>05 → {t('Donner envie', 'Desire')}</Label>
        <Lede>
          {t(
            'Un outil de suivi se vide si seule la valeur compte. Trois mécaniques gardent l’envie de continuer.',
            'A tracking tool empties out if only value matters. Three mechanics keep the desire to continue.'
          )}
        </Lede>
        <div className="mt-14 grid grid-cols-1 gap-1 md:mt-20 md:grid-cols-3">
          {hooks(t).map((h) => (
            <Reveal key={h.f}>
              <div className="bg-[#0b0c0e] text-white">
                <div className="flex justify-center px-[14%] pt-[8%]">
                  <Image src={`/foil/p/${h.f}.webp`} alt={h.n} width={780} height={1688} sizes="(min-width:768px) 30vw, 70vw" className="h-auto w-full rounded-t-[5%]" />
                </div>
              </div>
              <h3 className="px-2 pt-3 text-[22px] leading-[1.1] md:px-0" style={DISPLAY}>{h.n}</h3>
              <p className="max-w-[420px] px-2 pt-2 text-[15px] leading-[1.45] text-black/60 md:px-0">{h.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* notes */}
      <section id="notes" className="scroll-mt-8 border-t border-black/20 px-2 py-20 md:px-3 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-3">
          <div className="md:col-span-5">
            <Label>06 → {t('Données et illustrations', 'Data and artwork')}</Label>
            <p className="max-w-[460px] text-[15px] leading-[1.5] text-black/70">
              {t(
                'Les valeurs affichées sont des chiffres de démonstration, pas des prix réels : une version réelle demanderait une source de prix et un taux de change fiables. Les cartes Pokémon, One Piece et Yu-Gi-Oh! illustrent le produit et appartiennent à leurs ayants droit. Les cartes dessinées en points sont des créations originales.',
                'The values shown are demonstration figures, not real prices: a real version would need a reliable price source and exchange rate. The Pokémon, One Piece and Yu-Gi-Oh! cards illustrate the product and belong to their rights holders. The dotted cards are original creations.'
              )}
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Label>{t('La suite', 'What’s next')}</Label>
            <p className="max-w-[460px] text-[15px] leading-[1.5] text-black/70">
              {t(
                'Confronter le concept à d’autres collectionneurs pour vérifier que le tri par jeu, la complétion de série et le gain net répondent à leur façon de décider, puis prototyper le scan.',
                'Put the concept in front of other collectors to check that sorting by game, set completion and net gain match how they decide, then prototype the scan.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-[3px] border-[#0a0a0a] px-2 pb-28 pt-2 md:px-3 md:pb-32">
        <span className={`${TXT} text-black/45`}>{t('Projet suivant', 'Next project')}</span>
        <div className="mt-4">
          <Link href={np.link} className="group">
            <span className="text-[11vw] leading-[0.95] transition group-hover:opacity-50 md:text-[5vw]" style={DISPLAY}>{t(np.title.fr, np.title.en)} →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
