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
        </>,
        <>
          <p>
            Post Archive Faction is one of my favourite labels: strong photography, a singular
            approach to layering, and a founder who comes from UX/UI himself and brings that
            sensibility to clothing. I wanted to pay tribute to it through a personal project,
            also designed as a playground for UI and motion.
          </p>
          <p>
            The concept: a digital museum where you move between pieces as in a gallery, with a
            column of works on the left and an immersive scene on the right that changes with
            each selection. The mood of the site (materials, slowness, sculptural textures) aims
            to capture the energy of the garments themselves, completed by an editorial page
            telling the story of the label.
          </p>
        </>
      )}
      next={{ href: '/hennessy', title: 'Hennessy X.O' }}
    >
      <Media src="/paf-video-1.mp4" alt={t('Post Archive Faction — navigation dans les œuvres', 'Post Archive Faction — browsing the works')} width={864} height={616} video />

      <Chapter title={t('La galerie', 'The gallery')}>
        <p>
          {t(
            'À gauche, la colonne d’œuvres ; à droite, une scène immersive qui change à chaque sélection.',
            'On the left, the column of works; on the right, an immersive scene that changes with each selection.'
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
        <Media src="/PAF2.png" alt={t('Post Archive Faction — affiche', 'Post Archive Faction — poster')} width={2480} height={3508} />
        <Media src="/PAF3.png" alt={t('Post Archive Faction — page éditoriale', 'Post Archive Faction — editorial page')} width={1080} height={1350} />
      </Row>

      <Chapter title="Motion">
        <p>
          {t(
            'Des scènes générées puis animées pour prolonger l’univers de la marque.',
            'Scenes generated and then animated to extend the label’s world.'
          )}
        </p>
      </Chapter>
      <Media src="/paf-video-3.mp4" alt={t('Post Archive Faction — film', 'Post Archive Faction — film')} width={766} height={1102} video className="max-w-xl mx-auto" />
    </ProjectPage>
  );
}
