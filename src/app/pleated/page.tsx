'use client';

import { ProjectPage, Media, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="Pleated Assortment"
      subtitle={t('Mobilier inspiré du plissé d’Issey Miyake', 'Furniture inspired by Issey Miyake’s pleats')}
      meta={{
        year: '2024',
        context: t('Projet personnel', 'Personal project'),
        role: t('Direction créative, UI', 'Creative direction, UI'),
        tools: 'Figma, DALL·E',
      }}
      intro={t(
        <p>
          Un projet d&apos;exploration : transposer le plissé signature d&apos;Issey Miyake, que
          j&apos;admire dans son travail sur le vêtement, à une collection de mobilier. Une fois
          les pièces générées, j&apos;ai construit autour une interface e-commerce pour les
          présenter et m&apos;entraîner à l&apos;UI.
        </p>,
        <p>
          An exploratory project: carrying Issey Miyake&apos;s signature pleats, which I admire
          in his clothing, over to a furniture collection. Once the pieces were generated, I
          built an e-commerce interface around them to present them and sharpen my UI skills.
        </p>
      )}
      next={{ href: '/aether', title: 'Aether' }}
    >
      <Media src="/pleatedcover.png" alt={t('Pleated Assortment — pièce murale plissée', 'Pleated Assortment — pleated wall piece')} width={1792} height={1024} priority />
      <Media src="/pleated2.png" alt={t('Pleated Assortment — la collection', 'Pleated Assortment — the collection')} width={1856} height={1048} />

      <Chapter title={t('La boutique', 'The shop')}>
        <p>
          {t(
            'Une vitrine e-commerce épurée, où la matière plissée reste au premier plan.',
            'A pared-back e-commerce storefront where the pleated material stays front and centre.'
          )}
        </p>
      </Chapter>
      <Media src="/pleated1.png" alt={t('Pleated Assortment — page d’accueil desktop', 'Pleated Assortment — desktop homepage')} width={1920} height={1080} />
      <Media src="/pleatedvid.mp4" alt={t('Pleated Assortment — fiche produit mobile animée', 'Pleated Assortment — animated mobile product page')} width={1080} height={1080} video className="max-w-2xl mx-auto" />
    </ProjectPage>
  );
}
