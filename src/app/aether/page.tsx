'use client';

import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';

const cards = Array.from({ length: 22 }, (_, i) => `/aether-cards/card-${String(i + 1).padStart(2, '0')}.jpg`);

export default function Page() {
  return (
    <ProjectPage
      title="Aether"
      subtitle="Design system pour un jeu de tarot"
      meta={[
        { label: 'Année', value: '2024' },
        { label: 'Contexte', value: 'Projet d’équipe, ESD' },
        { label: 'Rôle', value: 'Univers, direction visuelle des cartes' },
        { label: 'Outils', value: 'Figma, Photoshop, Midjourney' },
      ]}
      intro={
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
        </>
      }
      next={{ href: '/post-archive-faction', title: 'Post Archive Faction' }}
    >
      <Media src="/AETHERCOVER.png" alt="Aether — visuel d’univers" width={1445} height={1024} priority />

      <Chapter title="Les 22 arcanes majeures">
        <p>
          De l&apos;Initiation au Purgatoire, chaque carte est une étape du voyage de
          l&apos;âme. Même cadre, mêmes ornements, même traitement monochrome : c&apos;est le
          système qui garantit l&apos;unité du jeu.
        </p>
      </Chapter>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {cards.map((src, i) => (
          <div key={src} className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]">
            <Media src={src} alt={`Aether — arcane ${i + 1}`} width={322} height={599} />
          </div>
        ))}
      </div>

      <Chapter title="Le système">
        <p>
          Colorimétrie, textures, ornements et texte forment les composants de base.
          L&apos;IA produit un rendu de départ, assemblé puis retouché à la main jusqu&apos;au
          rendu final.
        </p>
      </Chapter>
      <Media src="/aether-system-diagram.png" alt="Aether — schéma du design system" width={1440} height={420} />
      <Media src="/aether-ai-diagram.png" alt="Aether — mécanisme de génération IA" width={1440} height={400} />

      <Chapter title="Un alphabet propre">
        <p>
          Pour ancrer l&apos;univers, nous sommes allés jusqu&apos;à inventer un alphabet de
          treize caractères propre à Aether.
        </p>
      </Chapter>
      <Media src="/aether-alphabet-glyphs.png" alt="Aether — alphabet de treize caractères" width={843} height={319} className="max-w-2xl mx-auto" />
    </ProjectPage>
  );
}
