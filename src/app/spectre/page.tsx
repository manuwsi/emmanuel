'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

const spread = (n: number, alt: string) => ({ src: `/spectre${n}.jpg`, alt });

export default function Page() {
  return (
    <ProjectPage
      title="SPECTRE"
      subtitle="Magazine éditorial généré par IA"
      meta={[
        { label: 'Année', value: '2025' },
        { label: 'Contexte', value: 'OKCC' },
        { label: 'Rôle', value: 'Séries vert & violet, mise en page' },
        { label: 'Outils', value: 'InDesign, Figma, Midjourney' },
      ]}
      intro={
        <>
          <p>
            SPECTRE est né d&apos;un exercice interne chez OKCC : explorer ce que
            l&apos;intelligence artificielle permet en matière d&apos;image, avec une totale
            liberté artistique. Seule contrainte, chaque membre de l&apos;équipe recevait deux
            couleurs imposées à décliner en série.
          </p>
          <p>
            Le résultat a été imprimé et offert aux clients du groupe (dont LVMH) à Noël, à la
            fois comme démonstration de savoir-faire et comme objet à part entière. J&apos;ai
            porté les deux séries vert et violet, et la mise en page complète sous InDesign.
          </p>
        </>
      }
      next={{ href: '/ai-research', title: 'AI Visual Research' }}
    >
      <Row cols={2}>
        <Media src="/spectre1.png" alt="SPECTRE — couverture du magazine imprimé" width={1080} height={1350} priority />
        <Media src="/spectre2.png" alt="SPECTRE — magazine ouvert" width={1080} height={1350} priority />
      </Row>

      <Chapter title="Série verte">
        <p>Voiles, mousse et lumière rasante : des silhouettes suspendues dans des galeries minérales.</p>
      </Chapter>
      <Media src="/spectre3.png" alt="SPECTRE — série verte, voile" width={1080} height={1350} className="max-w-3xl mx-auto" />
      {[spread(11, 'double page Clover Green'), spread(12, 'double page galerie'), spread(13, 'double page voiles'), spread(15, 'double page sculptures')].map((s) => (
        <Media key={s.src} src={s.src} alt={`SPECTRE — ${s.alt}`} width={1214} height={842} />
      ))}

      <Chapter title="Série violette">
        <p>Pétales, reflets et matière translucide, à mi-chemin entre la botanique et le verre.</p>
      </Chapter>
      <Media src="/spectre4.png" alt="SPECTRE — série violette, pétale" width={1080} height={1350} className="max-w-3xl mx-auto" />
      {[spread(14, 'double page Amethyst Purple'), spread(17, 'double page pétales'), spread(18, 'double page reflets')].map((s) => (
        <Media key={s.src} src={s.src} alt={`SPECTRE — ${s.alt}`} width={1214} height={842} />
      ))}
    </ProjectPage>
  );
}
