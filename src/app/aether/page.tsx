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
            Aether est un jeu de tarot de 22 cartes, fait à quatre à l&apos;ESD. Pour que les
            cartes se ressemblent sans être identiques, nous avons d&apos;abord construit un
            design system : couleurs, textures, ornements et typographie, assemblés sur chaque
            carte. L&apos;IA donne un premier rendu, que nous retouchons ensuite à la main.
          </p>
          <p>
            Le jeu a son histoire : les âmes des morts traversent le royaume d&apos;Aether, entre
            la mort et le purgatoire, et chaque arcane majeure est une étape de ce voyage.
            J&apos;ai participé à tout le projet, de l&apos;écriture de l&apos;univers à la
            direction visuelle des cartes.
          </p>
        </>,
        <>
          <p>
            Aether is a 22-card tarot deck made by a team of four at ESD. To keep the cards
            consistent without making them identical, we first built a design system: colours,
            textures, ornaments and typography, assembled on each card. AI gives a first render,
            which we then retouch by hand.
          </p>
          <p>
            The deck has its own story: the souls of the dead cross the realm of Aether, between
            death and purgatory, and each major arcana is one step of that journey. I worked on
            the whole project, from writing the world to the art direction of the cards.
          </p>
        </>
      )}
    >
      <Media src="/AETHERCOVER.png" alt={t('Aether — visuel d’univers', 'Aether — key visual')} width={1445} height={1024} priority />

      <Chapter title={t('Les 22 arcanes majeures', 'The 22 major arcana')}>
        <p>
          {t(
            'De l’Initiation au Purgatoire, chaque carte est une étape du voyage de l’âme. Même cadre, mêmes ornements, même traitement monochrome : c’est ce qui fait tenir le jeu ensemble.',
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
            'Nous avons aussi inventé un alphabet de treize caractères, propre à Aether.',
            'We also invented a thirteen-character alphabet of its own.'
          )}
        </p>
      </Chapter>
      <Media src="/aether-alphabet-glyphs.png" alt={t('Aether — alphabet de treize caractères', 'Aether — thirteen-character alphabet')} width={843} height={319} className="max-w-2xl mx-auto" />
    </ProjectPage>
  );
}
