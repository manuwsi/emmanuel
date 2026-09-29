'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  const sq = (n: number, fr: string, en: string) => (
    <Media src={`/${n}.png`} alt={`Z_Lab — ${t(fr, en)}`} width={1080} height={1080} />
  );

  return (
    <ProjectPage
      title="Z_Lab"
      subtitle={t('Refonte de site pour un studio d’architecture', 'Website redesign for an architecture studio')}
      meta={{
        year: '2025',
        context: t('Projet école, ESD', 'School project, ESD'),
        role: t('Audit, direction créative, UI/UX', 'Audit, creative direction, UI/UX'),
        tools: 'Figma, Protopie',
      }}
      intro={t(
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
        </>,
        <>
          <p>
            Z_Lab is a Korean architecture studio known for minimal, refined spaces. Studying
            their work, one thing kept coming back: the line, present in their architecture as
            much as in their visual identity. It became the common thread of the project.
          </p>
          <p>
            I started with an audit of their existing website to find what was holding their
            image back, then built a coherent whole that truly reflects their professionalism
            and artistic stance.
          </p>
        </>
      )}
    >
      <Media src="/2.png" alt={t('Z_Lab — page d’accueil', 'Z_Lab — homepage')} width={1080} height={1080} priority className="max-w-4xl mx-auto" />

      <Chapter title={t('Le site', 'The website')}>
        <p>
          {t(
            'Une page d’accueil sobre, un index des projets en grille, et des pages projet qui laissent toute la place à la photographie.',
            'A restrained homepage, a grid index of projects, and project pages that give photography all the room.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        {sq(1, 'site sur ordinateur', 'website on desktop')}
        {sq(3, 'index des projets', 'project index')}
      </Row>
      <Row cols={2}>
        {sq(4, 'page projet sur ordinateur', 'project page on desktop')}
        {sq(5, 'page projet', 'project page')}
      </Row>

      <Chapter title={t('Au-delà de l’écran', 'Beyond the screen')}>
        <p>
          {t(
            'Le même vocabulaire de lignes se prolonge sur mobile et sur les supports imprimés.',
            'The same language of lines carries over to mobile and to print.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        {sq(7, 'site sur mobile', 'website on mobile')}
        {sq(6, 'papeterie', 'stationery')}
      </Row>
    </ProjectPage>
  );
}
