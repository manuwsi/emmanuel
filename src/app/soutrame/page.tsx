'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

const P = { width: 1206, height: 2142 };

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="Soutrame"
      subtitle={t('Une marque de vêtements, du concept au premier drop', 'A clothing brand, from concept to first drop')}
      meta={{
        year: '2026',
        context: t('Projet personnel — marque fondée', 'Personal project — founded brand'),
        role: t(
          'Direction artistique, design des pièces, production, lancement',
          'Art direction, garment design, production, launch'
        ),
        tools: 'Reve',
      }}
      intro={t(
        <>
          <p>
            Soutrame est une marque de vêtements que je conçois et développe de bout en bout :
            identité visuelle, design des pièces, relation avec les fournisseurs, production et
            stratégie de lancement.
          </p>
          <p>
            Le premier drop est un ensemble technique, veste à capuche et pantalon à jambes
            détachables, en écru et gris lavande. Le lancement est en préparation.
          </p>
        </>,
        <>
          <p>
            Soutrame is a clothing brand I design and build end to end: visual identity, garment
            design, supplier relationships, production and launch strategy.
          </p>
          <p>
            The first drop is a technical set, a hooded jacket and trousers with detachable legs,
            in ecru and lavender grey. The launch is in preparation.
          </p>
        </>
      )}
    >
      <Row cols={2}>
        <Media src="/soutrame/front.jpg" alt={t('Soutrame — drop 01, vue de face', 'Soutrame — drop 01, front view')} {...P} priority />
        <Media src="/soutrame/down.jpg" alt={t('Soutrame — drop 01, veste et pantalon', 'Soutrame — drop 01, jacket and trousers')} {...P} priority />
      </Row>

      <Chapter title={t('Drop 01', 'Drop 01')}>
        <p>
          {t(
            'Un ensemble pensé comme une seule silhouette : volume ample, panneaux de couleur, cordons, zips et œillets métalliques, pantalon dont les jambes se détachent au genou.',
            'A set designed as a single silhouette: generous volume, colour panels, drawcords, zips and metal eyelets, trousers whose legs detach at the knee.'
          )}
        </p>
      </Chapter>
      <Media
        src="/soutrame/side.jpg"
        alt={t('Soutrame — drop 01, vue de profil', 'Soutrame — drop 01, side view')}
        {...P}
        className="max-w-md mx-auto"
      />

      <Chapter title={t('La chimère', 'The chimera')}>
        <p>
          {t(
            'Une créature hybride, emblème de cette première collection, brodée sur l’ensemble.',
            'A hybrid creature, the emblem of this first collection, embroidered on the set.'
          )}
        </p>
      </Chapter>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/soutrame/chimera.svg"
        alt={t('Soutrame — la chimère', 'Soutrame — the chimera')}
        width={360}
        height={360}
        className="invert mx-auto w-56 md:w-72 h-auto"
        loading="lazy"
      />
    </ProjectPage>
  );
}
