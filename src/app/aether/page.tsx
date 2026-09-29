'use client';

import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

const cards = Array.from({ length: 22 }, (_, i) => `/aether-cards/card-${String(i + 1).padStart(2, '0')}.jpg`);

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="Aether"
      subtitle={t('Design system pour un jeu de tarot', 'A design system for a tarot deck')}
      meta={{
        year: '2024',
        context: t('Projet d’équipe, ESD', 'Team project, ESD'),
        role: t('Univers, direction visuelle des cartes', 'Worldbuilding, card art direction'),
        tools: 'Figma, Photoshop, Midjourney',
      }}
      intro={t(
        <>
          <p>
            Aether est un jeu de tarot complet imaginé à quatre. Le défi n&apos;était pas
            seulement de dessiner 22 cartes, mais de construire un design system capable de
            les générer toutes de façon cohérente : une colorimétrie, des textures, des
            ornements et un traitement du texte pensés comme des briques assemblées à chaque
            carte, IA et retouche manuelle à l&apos;appui pour garder la qualité et
            l&apos;originalité de chaque rendu.
          </p>
          <p>
            Autour de ce système, nous avons construit un lore entier : les âmes des défunts
            traversent le royaume d&apos;Aether entre mort et purgatoire, chaque arcane majeure
            incarnant une étape de ce voyage initiatique. J&apos;ai contribué à l&apos;ensemble
            du projet, de la construction de l&apos;univers à la direction visuelle des cartes.
          </p>
        </>,
        <>
          <p>
            Aether is a complete tarot deck created by a team of four. The challenge wasn&apos;t
            just to draw 22 cards, but to build a design system able to generate all of them
            consistently: colour, textures, ornaments and typography designed as building blocks
            assembled on every card, with AI and manual retouching to keep each render unique
            and to a high standard.
          </p>
          <p>
            Around this system we built an entire lore: the souls of the dead cross the realm of
            Aether, between death and purgatory, each major arcana embodying one step of this
            initiatory journey. I contributed to the whole project, from worldbuilding to the
            art direction of the cards.
          </p>
        </>
      )}
      next={{ href: '/post-archive-faction', title: 'Post Archive Faction' }}
    >
      <Media src="/AETHERCOVER.png" alt={t('Aether — visuel d’univers', 'Aether — key visual')} width={1445} height={1024} priority />

      <Chapter title={t('Les 22 arcanes majeures', 'The 22 major arcana')}>
        <p>
          {t(
            'De l’Initiation au Purgatoire, chaque carte est une étape du voyage de l’âme. Même cadre, mêmes ornements, même traitement monochrome : c’est le système qui garantit l’unité du jeu.',
            'From Initiation to Purgatory, each card is one step of the soul’s journey. Same frame, same ornaments, same monochrome treatment: the system is what holds the deck together.'
          )}
        </p>
      </Chapter>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {cards.map((src, i) => (
          <div key={src} className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]">
            <Media src={src} alt={`Aether — arcana ${i + 1}`} width={322} height={599} />
          </div>
        ))}
      </div>

      <Chapter title={t('Le système', 'The system')}>
        <p>
          {t(
            'Colorimétrie, textures, ornements et texte forment les composants de base. L’IA produit un rendu de départ, assemblé puis retouché à la main jusqu’au rendu final.',
            'Colour, textures, ornaments and text are the base components. AI produces a first render, which is assembled and then retouched by hand until the final result.'
          )}
        </p>
      </Chapter>
      <Media src="/aether-system-diagram.png" alt={t('Aether — schéma du design system', 'Aether — design system diagram')} width={1440} height={420} />
      <Media src="/aether-ai-diagram.png" alt={t('Aether — mécanisme de génération IA', 'Aether — AI generation pipeline')} width={1440} height={400} />

      <Chapter title={t('Un alphabet propre', 'A dedicated alphabet')}>
        <p>
          {t(
            'Pour ancrer l’univers, nous sommes allés jusqu’à inventer un alphabet de treize caractères propre à Aether.',
            'To root the world, we went as far as inventing a thirteen-character alphabet of its own.'
          )}
        </p>
      </Chapter>
      <Media src="/aether-alphabet-glyphs.png" alt={t('Aether — alphabet de treize caractères', 'Aether — thirteen-character alphabet')} width={843} height={319} className="max-w-2xl mx-auto" />
    </ProjectPage>
  );
}
