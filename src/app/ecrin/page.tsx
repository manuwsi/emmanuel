'use client';

import Image from 'next/image';
import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

type T = <V,>(fr: V, en: V) => V;

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="block text-[13px] text-black/45">{children}</span>;
}

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

const moments = (t: T) => [
  { n: '01', title: t('Ajouter', 'Add'), text: t('Un scan en boutique : la carte est reconnue, on note le prix payé dans sa devise.', 'One scan in the shop: the card is recognised, the price paid is noted in its own currency.') },
  { n: '02', title: t('Suivre', 'Follow'), text: t('Toute la collection au même endroit, triée par jeu, langue ou valeur, avec l’écart au prix payé.', 'The whole collection in one place, sorted by game, language or value, with the gap to the price paid.') },
  { n: '03', title: t('Vendre', 'Sell'), text: t('Le gain net, une fois les frais, l’envoi et le change retirés, avant de décider.', 'The net gain, once fees, shipping and exchange are taken off, before deciding.') },
];

const screens = (t: T) => [
  { f: 'collection', name: t('Collection', 'Collection') },
  { f: 'scan', name: t('Scan', 'Scan') },
  { f: 'fiche', name: t('Fiche carte', 'Card page') },
  { f: 'valeur', name: t('Évolution', 'Evolution') },
  { f: 'vendre', name: t('Revente', 'Sale') },
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
          'Rendu 3D de la même carte holographique sous trois angles de lumière : le reflet change avec l’angle',
          '3D render of the same holographic card under three light angles: the reflection changes with the angle'
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
            'L’interface s’efface devant les cartes : fond sombre, une donnée dominante par écran, des traits fins plutôt que des cartes arrondies.',
            'The interface steps back for the cards: dark background, one dominant figure per screen, hairlines instead of rounded cards.'
          )}
        </p>
      </Chapter>
      <Media
        src="/ecrin/duo.jpg"
        alt={t(
          'Rendu 3D : une carte holographique à côté de l’écran Collection sur iPhone',
          '3D render: a holographic card next to the Collection screen on iPhone'
        )}
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

      <Chapter title={t('La carte', 'The card')}>
        <p>
          {t(
            'La carte est le héros de l’application. Son illustration est dessinée en points, comme une donnée, et son reflet holographique change selon l’angle de la lumière.',
            'The card is the hero of the app. Its illustration is drawn in dots, like data, and its holographic reflection changes with the angle of the light.'
          )}
        </p>
        <p>
          {t(
            'Les cartes montrées ici sont des créations originales pour le projet. Les images se remplacent par de vraies cartes sans toucher à l’interface.',
            'The cards shown here are original creations for the project. The images can be swapped for real cards without touching the interface.'
          )}
        </p>
      </Chapter>
      <Media
        src="/ecrin/carte.jpg"
        alt={t('Rendu 3D d’une carte holographique, illustrée en points', '3D render of a holographic card illustrated in dots')}
        width={1700}
        height={1275}
      />

      <Chapter title={t('Les écrans', 'The screens')}>
        <p>
          {t(
            'Cinq écrans suivent le parcours : ajouter, suivre, comprendre une carte, voir l’évolution, vendre.',
            'Five screens follow the journey: add, follow, understand a card, see the evolution, sell.'
          )}
        </p>
        <p>
          {t(
            'Les valeurs affichées sont des chiffres de démonstration, pas des prix de marché réels.',
            'The figures shown are demonstration values, not real market prices.'
          )}
        </p>
      </Chapter>
      <Media
        src="/ecrin/phones.jpg"
        alt={t('Rendu 3D de trois iPhone : collection, fiche carte, évolution', '3D render of three iPhones: collection, card page, evolution')}
        width={1700}
        height={1062}
      />
      <ol className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-start">
        {screens(t).map((p) => (
          <li key={p.f} className="space-y-2">
            <Image
              src={`/ecrin/p/${p.f}.webp`}
              alt={t(`Écran iPhone : ${p.name}`, `iPhone screen: ${p.name}`)}
              width={780}
              height={1688}
              sizes="(max-width: 768px) 50vw, 260px"
              className="w-full h-auto block border border-black/10"
            />
            <Caption>{p.name}</Caption>
          </li>
        ))}
      </ol>

      <Chapter title={t('La suite', 'What’s next')}>
        <p>
          {t(
            'Prochaine étape : confronter le concept à d’autres collectionneurs, pour vérifier que le tri par jeu et le gain net répondent à leur façon de décider, puis prototyper le scan.',
            'Next step: putting the concept in front of other collectors, to check that sorting by game and net gain match how they decide, then prototyping the scan.'
          )}
        </p>
      </Chapter>
    </ProjectPage>
  );
}
