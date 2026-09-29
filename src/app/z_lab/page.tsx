'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

const sq = (n: number, alt: string) => (
  <Media src={`/${n}.png`} alt={`Z_Lab — ${alt}`} width={1080} height={1080} />
);

export default function Page() {
  return (
    <ProjectPage
      title="Z_Lab"
      subtitle="Refonte de site pour un studio d’architecture"
      meta={[
        { label: 'Année', value: '2025' },
        { label: 'Contexte', value: 'Projet école, ESD' },
        { label: 'Rôle', value: 'Audit, direction créative, UI/UX' },
        { label: 'Outils', value: 'Figma, Protopie' },
      ]}
      intro={
        <>
          <p>
            Z_Lab est un studio d&apos;architecture coréen connu pour ses espaces minimaux et
            sophistiqués. En étudiant leurs réalisations, une chose revenait sans cesse : la
            ligne, présente aussi bien dans leur architecture que dans leur identité visuelle.
            C&apos;est devenu le fil conducteur du projet.
          </p>
          <p>
            J&apos;ai commencé par un audit de leur site existant pour identifier ce qui
            desservait leur image, avant de construire un ensemble cohérent qui reflète vraiment
            leur professionnalisme et leur parti pris artistique.
          </p>
        </>
      }
      next={{ href: '/spectre', title: 'SPECTRE' }}
    >
      <Media src="/2.png" alt="Z_Lab — page d’accueil" width={1080} height={1080} priority className="max-w-4xl mx-auto" />

      <Chapter title="Le site">
        <p>Une page d&apos;accueil sobre, un index des projets en grille, et des pages projet qui laissent toute la place à la photographie.</p>
      </Chapter>
      <Row cols={2}>
        {sq(1, 'site sur ordinateur')}
        {sq(3, 'index des projets')}
      </Row>
      <Row cols={2}>
        {sq(4, 'page projet sur ordinateur')}
        {sq(5, 'page projet')}
      </Row>

      <Chapter title="Au-delà de l’écran">
        <p>Le même vocabulaire de lignes se prolonge sur mobile et sur les supports imprimés.</p>
      </Chapter>
      <Row cols={2}>
        {sq(7, 'site sur mobile')}
        {sq(6, 'papeterie')}
      </Row>
    </ProjectPage>
  );
}
