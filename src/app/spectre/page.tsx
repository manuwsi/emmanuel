'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  const spread = (n: number) => (
    <Media key={n} src={`/spectre${n}.jpg`} alt={t(`SPECTRE — double page ${n}`, `SPECTRE — spread ${n}`)} width={1214} height={842} />
  );

  return (
    <ProjectPage
      title="SPECTRE"
      subtitle={t('Magazine éditorial généré par IA', 'An AI-generated editorial magazine')}
      meta={{
        year: '2025',
        context: 'OKCC',
        role: t('Séries vert & violet, mise en page', 'Green & purple series, layout'),
        tools: 'InDesign, Figma, Midjourney',
      }}
      intro={t(
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
        </>,
        <>
          <p>
            SPECTRE started as an internal exercise at OKCC: exploring what artificial
            intelligence can do for imagery, with complete artistic freedom. The only rule: each
            team member was given two colours to develop into a series.
          </p>
          <p>
            The result was printed and given to the group&apos;s clients (including LVMH) at
            Christmas, both as a showcase of craft and as an object in its own right. I led the
            green and purple series and the full layout in InDesign.
          </p>
        </>
      )}
    >
      <Row cols={2}>
        <Media src="/spectre1.png" alt={t('SPECTRE — couverture du magazine imprimé', 'SPECTRE — printed magazine cover')} width={1080} height={1350} priority />
        <Media src="/spectre2.png" alt={t('SPECTRE — magazine ouvert', 'SPECTRE — open magazine')} width={1080} height={1350} priority />
      </Row>

      <Chapter title={t('Série verte', 'Green series')}>
        <p>
          {t(
            'Voiles, mousse et lumière rasante : des silhouettes suspendues dans des galeries minérales.',
            'Veils, moss and grazing light: figures suspended in mineral galleries.'
          )}
        </p>
      </Chapter>
      <Media src="/spectre3.png" alt={t('SPECTRE — série verte, voile', 'SPECTRE — green series, veil')} width={1080} height={1350} className="max-w-3xl mx-auto" />
      {[11, 12, 13, 15].map(spread)}

      <Chapter title={t('Série violette', 'Purple series')}>
        <p>
          {t(
            'Pétales, reflets et matière translucide, à mi-chemin entre la botanique et le verre.',
            'Petals, reflections and translucent matter, somewhere between botany and glass.'
          )}
        </p>
      </Chapter>
      <Media src="/spectre4.png" alt={t('SPECTRE — série violette, pétale', 'SPECTRE — purple series, petal')} width={1080} height={1350} className="max-w-3xl mx-auto" />
      {[14, 17, 18].map(spread)}
    </ProjectPage>
  );
}
