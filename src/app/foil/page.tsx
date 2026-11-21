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
          src={phone ? '/foil/cover-v2.jpg' : '/foil/hero-v2.jpg'}
          alt={t('Gros plan d’un iPhone tenu en main, sur l’écran évolution de Foil : plus 718 euros', 'Close-up of an iPhone held in hand, on Foil’s growth screen: plus 718 euros')}
          sizes="100vw"
          position={phone ? '42% 50%' : 'center'}
          priority
          force
        />
      </section>

      {/* intro */}
      <section className="px-2 pb-28 pt-16 md:px-3 md:pb-40 md:pt-28">
        <Lede>
          {t(
            'Une appli pour suivre ma collection de cartes et savoir ce que je gagnerais en les revendant.',
            'An app to track my card collection and see what I would make by selling it.'
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
                'Foil est un concept d’application iOS. On y range ses cartes Pokémon, One Piece ou Yu-Gi-Oh!, avec ce qu’on a payé et ce qu’elles valent aujourd’hui.',
                'Foil is a concept iOS app. You keep your Pokémon, One Piece or Yu-Gi-Oh! cards in it, with what you paid and what they are worth today.'
              )}
            </p>
            <p className="text-black/60">
              {t(
                'Je pars de mon cas : j’achète des cartes en Chine et au Japon pour les garder plusieurs années, puis les revendre en Europe. Je n’ai pas trouvé d’outil qui garde le prix payé en yuans ou en yens à côté de la valeur actuelle.',
                'I started from my own case: I buy cards in China and Japan to keep for several years, then sell in Europe. I haven’t found a tool that keeps the price paid in yuan or yen next to the current value.'
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
            'Suivre ses cartes aujourd’hui, c’est plusieurs applis et plusieurs devises.',
            'Tracking cards today means several apps and several currencies.'
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
        src="/foil/duo-v4.jpg"
        aspect="1700/1062" mobileAspect="1700/1062"
        alt={t('L’accueil de l’application et la fiche d’une carte, sur iPhone', 'The app’s home screen and a card page, on iPhone')}
        caption={t('L’accueil et la fiche d’une carte.', 'The home screen and a card page.')}
      />

      {/* the concept */}
      <section id="concept" className="scroll-mt-8 px-2 py-28 md:px-3 md:py-40">
        <Label>02 → {t('Le concept', 'The concept')}</Label>
        <Lede>
          {t(
            'Une seule collection pour tous les jeux. Chaque carte affiche ce qu’elle vaut et l’écart avec ce que j’ai payé.',
            'One collection for every game. Each card shows what it is worth and the gap with what I paid.'
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
        src="/foil/collection-main.jpg"
        mobileSrc="/foil/collection-main-m.jpg"
        aspect="2400/960" mobileAspect="1600/1200"
        alt={t('Une main tient l’iPhone, à contre-jour, sur l’écran Collection : des cartes de trois jeux', 'A hand holds the iPhone against the light, on the Collection screen: cards from three games')}
        caption={t('Une seule collection, trois jeux.', 'One collection, three games.')}
      />

      {/* the product: one dark chapter */}
      <section id="produit" className="scroll-mt-0 bg-[#08090b] px-2 py-28 text-white md:px-3 md:py-40">
        <Label dark>03 → {t('Le produit', 'The product')}</Label>
        <Lede dark>
          {t(
            'La carte reste au centre de l’écran. Je l’ai éclairée comme un objet : son reflet bouge avec le doigt.',
            'The card stays at the centre of the screen. I lit it like an object: its reflection moves with your finger.'
          )}
        </Lede>
        <div className="mt-14 md:mt-20">
          <p className={`${TXT} pb-2 text-white/55`}>{t('Touche la carte', 'Touch the card')} <span className="ml-2 text-white/35">{t('Bouge sur la carte', 'Move over the card')} →</span></p>
          <HoloCard />
        </div>
        <div className="mt-24 md:mt-40">
          <Lede dark>
            {t(
              'Toute la collection sur un écran : un point par carte, regroupés par jeu. Plus une carte vaut cher, plus son point est gros.',
              'The whole collection on one screen: one dot per card, grouped by game. The more a card is worth, the bigger its dot.'
            )}
          </Lede>
          <p className={`${TXT} pb-2 pt-14 text-white/55 md:pt-20`}>{t('La collection en points', 'The collection in dots')}</p>
          <Constellation />
        </div>
        <div className="mt-24 md:mt-40">
          <Lede dark>
            {t(
              'Un exemple : j’achète une carte à Tokyo et je la revends trois ans plus tard.',
              'An example: I buy a card in Tokyo and sell it three years later.'
            )}
          </Lede>
          <p className={`${TXT} pb-2 pt-14 text-white/55 md:pt-20`}>{t('Scénario', 'Scenario')}</p>
          <Story />
        </div>
        <div className="mt-24 md:mt-40">
          <Label dark>{t('Choix de design', 'Design choices')}</Label>
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
              'Le parcours complet, de la découverte à la revente.',
              'The full journey, from discovery to resale.'
            )}
          </Lede>
        </div>
        <div>
          <Strip items={screens} label={t('Les écrans', 'The screens')} hint={t('Faire glisser', 'Drag')} />
        </div>
      </section>

      <Plate
        src="/foil/scan-main.jpg"
        mobileSrc="/foil/scan-main-m.jpg"
        aspect="2400/1350" mobileAspect="1600/1200"
        alt={t('Un doigt touche la carte reconnue sur l’écran Scan, à contre-jour', 'A finger taps the recognised card on the Scan screen, against the light')}
        caption={t('Cadrer une carte pour l’ajouter.', 'Frame a card to add it.')}
      />

      {/* desire */}
      <section id="envie" className="scroll-mt-8 px-2 py-28 md:px-3 md:py-40">
        <Label>05 → {t('Donner envie', 'Desire')}</Label>
        <Lede>
          {t(
            'Une appli qui ne montre que de l’argent, on finit par ne plus l’ouvrir. J’ai ajouté trois choses pour y revenir.',
            'An app that only shows money ends up unopened. I added three things to bring people back.'
          )}
        </Lede>
        <div className="mt-14 grid grid-cols-1 gap-1 md:mt-20 md:grid-cols-3">
          {hooks(t).map((h) => (
            <Reveal key={h.f}>
              <div className="bg-[#0b0c0e] text-white">
                <div className="flex justify-center px-[14%] pt-[8%]">
                  <Image unoptimized loading="eager" src={`/foil/p/${h.f}.webp`} alt={h.n} width={780} height={1688} sizes="(min-width:768px) 30vw, 70vw" className="h-auto w-full rounded-t-[5%]" />
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
                'Les valeurs affichées sont des chiffres de démonstration, pas de vrais prix. Une vraie version aurait besoin d’une source de prix et d’un taux de change fiables. Les cartes Pokémon, One Piece et Yu-Gi-Oh! appartiennent à leurs ayants droit. Les cartes dessinées en points sont les miennes.',
                'The values shown are demonstration figures, not real prices. A real version would need a reliable price source and exchange rate. The Pokémon, One Piece and Yu-Gi-Oh! cards belong to their rights holders. The dotted cards are mine.'
              )}
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Label>{t('La suite', 'What’s next')}</Label>
            <p className="max-w-[460px] text-[15px] leading-[1.5] text-black/70">
              {t(
                'Montrer le concept à d’autres collectionneurs et leur demander comment ils décident d’acheter ou de vendre. Ensuite, prototyper le scan.',
                'Show the concept to other collectors and ask how they decide to buy or sell. Then prototype the scan.'
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
