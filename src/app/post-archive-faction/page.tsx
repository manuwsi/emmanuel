'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="Post Archive Faction"
      subtitle={t('Un musée digital pour une marque de mode', 'A digital museum for a fashion label')}
      meta={{
        year: '2025',
        context: t('Projet personnel', 'Personal project'),
        role: t('Direction créative, UI, motion', 'Creative direction, UI, motion'),
        tools: 'Figma, After Effects, Midjourney, Kling',
      }}
      intro={t(
        <>
          <p>
            Post Archive Faction est l&apos;une de mes marques préférées : des photos fortes, une
            façon particulière de superposer les couches, et un fondateur qui vient lui-même du
            UX/UI. J&apos;en ai fait un projet perso, pour m&apos;entraîner en UI et en motion.
          </p>
          <p>
            L&apos;idée : un musée en ligne où l&apos;on passe d&apos;une pièce à l&apos;autre
            comme dans une galerie. À gauche, la liste des pièces ; à droite, une grande scène qui
            change à chaque sélection. Le site est lent et très texturé, comme les vêtements. Une
            page éditoriale raconte l&apos;histoire de la marque.
          </p>
        </>,
        <>
          <p>
            Post Archive Faction is one of my favourite labels: strong photos, a particular way
            of layering, and a founder who comes from UX/UI himself. I turned it into a personal
            project to practise UI and motion.
          </p>
          <p>
            The idea: an online museum where you move from piece to piece as in a gallery. On
            the left, the list of pieces; on the right, a large scene that changes with each
            selection. The site is slow and heavily textured, like the clothes. An editorial page
            tells the label&apos;s story.
          </p>
        </>
      )}
    >
      <Media src="/paf-video-1.mp4" alt={t('Post Archive Faction — navigation dans les œuvres', 'Post Archive Faction — browsing the works')} width={864} height={616} video />

      <Chapter title={t('La galerie', 'The gallery')}>
        <p>
          {t(
            'On choisit une pièce dans la colonne de gauche, la scène de droite change.',
            'Pick a piece in the left column and the scene on the right changes.'
          )}
        </p>
      </Chapter>
      <Media src="/paf-video-2.mp4" alt={t('Post Archive Faction — vue galerie', 'Post Archive Faction — gallery view')} width={864} height={616} video />

      <Chapter title={t('Éditorial', 'Editorial')}>
        <p>
          {t(
            'Une affiche en relief et une page qui retrace l’histoire de la marque.',
            'An embossed poster and a page tracing the label’s history.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        <Media src="/PAF2.webp" alt={t('Post Archive Faction — affiche', 'Post Archive Faction — poster')} width={2480} height={3508} />
        <Media src="/PAF3.webp" alt={t('Post Archive Faction — page éditoriale', 'Post Archive Faction — editorial page')} width={1080} height={1350} />
      </Row>

      <Chapter title="Motion">
        <p>
          {t(
            'Des scènes générées en IA puis animées, dans l’esprit des collections.',
            'Scenes generated with AI then animated, in the spirit of the collections.'
          )}
        </p>
      </Chapter>
      <Media src="/paf-video-3.mp4" alt={t('Post Archive Faction — film', 'Post Archive Faction — film')} width={766} height={1102} video className="max-w-xl mx-auto" />
    </ProjectPage>
  );
}
