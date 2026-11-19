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
      lede={t(
        'La refonte du site d’un studio d’architecture coréen, construite autour d’un seul élément : la ligne.',
        'A website redesign for a Korean architecture studio, built around a single element: the line.'
      )}
      meta={{
        year: '2025',
        context: t('Projet école, ESD', 'School project, ESD'),
        role: t('Audit, direction créative, UI/UX', 'Audit, creative direction, UI/UX'),
        tools: 'Figma, Protopie',
      }}
      intro={t(
        <>
          <p>
            Z_Lab est un studio d&apos;architecture coréen, connu pour ses espaces très épurés.
            En regardant leurs bâtiments et leur identité visuelle, j&apos;ai retrouvé partout la
            même chose : la ligne. J&apos;en ai fait la base de la refonte.
          </p>
          <p>
            Projet d&apos;école à l&apos;ESD. J&apos;ai commencé par un audit du site existant
            pour repérer ce qui ne rendait pas justice à leur travail, puis j&apos;ai redessiné le
            site, la version mobile et la papeterie avec le même système.
          </p>
        </>,
        <>
          <p>
            Z_Lab is a Korean architecture studio known for very pared-back spaces. Looking at
            their buildings and their visual identity, I kept finding the same thing: the line.
            I made it the basis of the redesign.
          </p>
          <p>
            A school project at ESD. I started with an audit of the existing site to see what
            wasn&apos;t doing their work justice, then redesigned the site, the mobile version and
            the stationery with the same system.
          </p>
        </>
      )}
    >
      <Media src="/2.png" alt={t('Z_Lab — page d’accueil', 'Z_Lab — homepage')} width={1080} height={1080} priority className="max-w-4xl mx-auto" />

      <Chapter n={1} title={t('Le site', 'The website')}>
        <p>
          {t(
            'Une page d’accueil sobre, un index des projets en grille, et des pages projet où la photo prend toute la place.',
            'A plain homepage, a grid index of projects, and project pages where the photos take up all the room.'
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

      <Chapter n={2} title={t('Mobile et papeterie', 'Mobile and stationery')}>
        <p>
          {t(
            'Les mêmes lignes sur mobile et sur les documents imprimés.',
            'The same lines on mobile and in print.'
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
