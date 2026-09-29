'use client';

import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';

export default function Page() {
  return (
    <ProjectPage
      title="Pleated Assortment"
      subtitle="Mobilier inspiré du plissé d’Issey Miyake"
      meta={[
        { label: 'Année', value: '2024' },
        { label: 'Contexte', value: 'Projet personnel' },
        { label: 'Rôle', value: 'Direction créative, UI' },
        { label: 'Outils', value: 'Figma, DALL·E' },
      ]}
      intro={
        <p>
          Un projet d&apos;exploration : transposer le plissé signature d&apos;Issey Miyake,
          que j&apos;admire dans son travail sur le vêtement, à une collection de mobilier. Une
          fois les pièces générées, j&apos;ai construit autour une interface e-commerce pour les
          présenter et m&apos;entraîner à l&apos;UI.
        </p>
      }
      next={{ href: '/aether', title: 'Aether' }}
    >
      <Media src="/pleatedcover.png" alt="Pleated Assortment — pièce murale plissée" width={1792} height={1024} priority />
      <Media src="/pleated2.png" alt="Pleated Assortment — la collection" width={1856} height={1048} />

      <Chapter title="La boutique">
        <p>Une vitrine e-commerce épurée, où la matière plissée reste au premier plan.</p>
      </Chapter>
      <Media src="/pleated1.png" alt="Pleated Assortment — page d’accueil desktop" width={1920} height={1080} />
      <Media src="/pleatedvid.mp4" alt="Pleated Assortment — fiche produit mobile animée" width={1080} height={1080} video className="max-w-2xl mx-auto" />
    </ProjectPage>
  );
}
