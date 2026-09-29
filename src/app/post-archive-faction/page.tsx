'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

export default function Page() {
  return (
    <ProjectPage
      title="Post Archive Faction"
      subtitle="Un musée digital pour une marque de mode"
      meta={[
        { label: 'Année', value: '2025' },
        { label: 'Contexte', value: 'Projet personnel' },
        { label: 'Rôle', value: 'Direction créative, UI, motion' },
        { label: 'Outils', value: 'Figma, After Effects, Midjourney, Kling' },
      ]}
      intro={
        <>
          <p>
            Post Archive Faction est l&apos;une de mes marques favorites : une photographie
            forte, un travail de layering singulier, et un fondateur lui-même issu du UX/UI, qui
            transpose cette sensibilité dans le vêtement. J&apos;ai voulu lui rendre hommage à
            travers un projet personnel, aussi pensé comme un terrain d&apos;entraînement pour
            l&apos;UI et le motion.
          </p>
          <p>
            Le concept : un musée digital où l&apos;on navigue entre les pièces comme dans une
            galerie, une colonne d&apos;œuvres en aperçu à gauche, une scène immersive à droite
            qui change à chaque sélection. L&apos;ambiance du site (matières, lenteur, textures
            sculpturales) cherche à retrouver l&apos;énergie des vêtements eux-mêmes, complétée
            par une page éditoriale qui raconte l&apos;histoire de la marque.
          </p>
        </>
      }
      next={{ href: '/hennessy', title: 'Hennessy X.O' }}
    >
      <Media src="/paf-video-1.mp4" alt="Post Archive Faction — navigation dans les œuvres" width={864} height={616} video />

      <Chapter title="La galerie">
        <p>À gauche, la colonne d&apos;œuvres ; à droite, une scène immersive qui change à chaque sélection.</p>
      </Chapter>
      <Media src="/paf-video-2.mp4" alt="Post Archive Faction — vue galerie" width={864} height={616} video />

      <Chapter title="Éditorial">
        <p>Une affiche en relief et une page qui retrace l&apos;histoire de la marque.</p>
      </Chapter>
      <Row cols={2}>
        <Media src="/PAF2.png" alt="Post Archive Faction — affiche" width={2480} height={3508} />
        <Media src="/PAF3.png" alt="Post Archive Faction — page éditoriale" width={1080} height={1350} />
      </Row>

      <Chapter title="Motion">
        <p>Des scènes générées puis animées pour prolonger l&apos;univers de la marque.</p>
      </Chapter>
      <Media src="/paf-video-3.mp4" alt="Post Archive Faction — film" width={766} height={1102} video className="max-w-xl mx-auto" />
    </ProjectPage>
  );
}
