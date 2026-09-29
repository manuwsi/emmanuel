'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

const P = { width: 1797, height: 2248 };
const W = { width: 1920, height: 1080 };

export default function Page() {
  const t = useT();
  return (
    <ProjectPage
      title="HIGAN"
      subtitle={t('Design d’un flacon de parfum, 3D & direction artistique', 'Perfume bottle design, 3D & art direction')}
      meta={{
        year: '2026',
        context: t('Projet personnel — court-métrage « From the Other Shore »', 'Personal project — short film “From the Other Shore”'),
        role: t('Design du flacon, 3D, direction artistique', 'Bottle design, 3D, art direction'),
        tools: 'Blender, Midjourney, Kling, Reve, Figma',
      }}
      intro={t(
        <>
          <p>
            Higan désigne « l&apos;autre rive » : le passage vers l&apos;autre monde. Son symbole est
            le lys araignée rouge, la fleur qui borde ce passage dans la tradition japonaise.
          </p>
          <p>
            Tout le flacon est une métaphore de cette traversée. La fleur est vidée de son essence :
            son rouge devient le liquide du parfum. Ce qu&apos;il reste d&apos;elle, entièrement noir,
            se métamorphose en une créature humanoïde déformée qui devient le bouchon du flacon. Son
            passage à elle vers l&apos;autre monde, c&apos;est de devenir parfum.
          </p>
        </>,
        <>
          <p>
            Higan means “the other shore”: the passage to the other world. Its symbol is the red
            spider lily, the flower that lines this passage in Japanese tradition.
          </p>
          <p>
            The whole bottle is a metaphor for that crossing. The flower is emptied of its essence:
            its red becomes the perfume itself. What remains of it, entirely black, transforms into a
            distorted humanoid creature that becomes the stopper. Its own passage to the other world
            is to become a perfume.
          </p>
        </>
      )}
    >
      <Row cols={2}>
        <Media src="/higan/packshot.jpg" alt={t('HIGAN — le flacon', 'HIGAN — the bottle')} {...P} priority />
        <Media src="/higan/silhouette.jpg" alt={t('HIGAN — visuel de campagne', 'HIGAN — campaign visual')} {...P} priority />
      </Row>

      <Chapter title={t('L’autre rive', 'The other shore')}>
        <p>
          {t(
            'Le court-métrage « From the Other Shore » pose le décor : un monde lointain, des côtes noires bordées d’un fleuve de lys rouges, que l’on traverse pour passer de l’autre côté.',
            'The short film “From the Other Shore” sets the scene: a distant world, black coastlines edged with a river of red lilies, to be crossed to reach the other side.'
          )}
        </p>
      </Chapter>
      <Media src="/higan/planet.jpg" alt={t('From the Other Shore — la planète', 'From the Other Shore — the planet')} {...W} />
      <Row cols={2}>
        <Media src="/higan/shore-1.jpg" alt={t('From the Other Shore — la côte', 'From the Other Shore — the coast')} width={1456} height={816} />
        <Media src="/higan/shore-river.jpg" alt={t('From the Other Shore — le fleuve rouge', 'From the Other Shore — the red river')} width={1456} height={816} />
      </Row>
      <Row cols={2}>
        <Media src="/higan/shore-light.jpg" alt={t('From the Other Shore — la côte dans la brume', 'From the Other Shore — the coast in the mist')} {...W} />
        <Media src="/higan/shore-road.jpg" alt={t('From the Other Shore — le chemin', 'From the Other Shore — the path')} width={1456} height={816} />
      </Row>

      <Chapter title={t('La métamorphose', 'The metamorphosis')}>
        <p>
          {t(
            'Au cœur du film, la fleur perd son rouge, se referme, puis se change en créature.',
            'At the heart of the film, the flower loses its red, closes up, then turns into a creature.'
          )}
        </p>
      </Chapter>
      <Media src="/higan/flower-red.jpg" alt={t('HIGAN — la fleur rouge', 'HIGAN — the red flower')} {...W} />
      <Row cols={2}>
        <Media src="/higan/flower-poppy.jpg" alt={t('HIGAN — la fleur qui s’assombrit', 'HIGAN — the flower darkening')} {...W} />
        <Media src="/higan/bud.mp4" alt={t('HIGAN — la fleur se referme', 'HIGAN — the flower closing')} width={1280} height={720} video />
      </Row>
      <Row cols={2}>
        <Media src="/higan/metamorphosis.jpg" alt={t('HIGAN — la matière noire prend forme', 'HIGAN — black matter taking shape')} {...W} />
        <Media src="/higan/creature.jpg" alt={t('HIGAN — la créature', 'HIGAN — the creature')} {...W} />
      </Row>

      <Chapter title={t('La sculpture', 'The sculpture')}>
        <p>
          {t(
            'La créature est sculptée en 3D, du modèle en terre au rendu final, puis devient le bouchon du flacon. Une forme pensée pour être lue sous tous les angles.',
            'The creature is sculpted in 3D, from clay model to final render, then becomes the bottle’s stopper: a form designed to read from every angle.'
          )}
        </p>
      </Chapter>
      <Media src="/higan/sculpt.mp4" alt={t('HIGAN — du modèle au rendu', 'HIGAN — from model to render')} width={1280} height={720} video />
      <Row cols={2}>
        <Media src="/higan/detail-1.jpg" alt={t('HIGAN — détail du bouchon', 'HIGAN — stopper detail')} {...P} />
        <Media src="/higan/detail-2.jpg" alt={t('HIGAN — détail du bouchon', 'HIGAN — stopper detail')} {...P} />
      </Row>
      <Media src="/higan/rotation.jpg" alt={t('HIGAN — le bouchon sous 16 angles', 'HIGAN — the stopper from 16 angles')} width={1798} height={2248} className="max-w-2xl mx-auto" />

      <Chapter title={t('L’univers', 'The world')}>
        <p>
          {t(
            'Une campagne autour du flacon, un événement fictif, un format ampoule, jusqu’à un t-shirt brodé du lys araignée et son éditorial.',
            'A campaign around the bottle, a fictional event, an ampoule format, down to a t-shirt embroidered with the spider lily and its editorial.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        <Media src="/higan/hand.jpg" alt={t('HIGAN — le flacon en main', 'HIGAN — the bottle in hand')} {...P} />
        <Media src="/higan/lycoris.jpg" alt={t('HIGAN — le flacon et le lys araignée', 'HIGAN — the bottle and the spider lily')} {...P} />
      </Row>
      <Media src="/higan/poster.jpg" alt={t('HIGAN — affiche « From the Other Shore »', 'HIGAN — “From the Other Shore” poster')} width={2000} height={1256} />
      <Row cols={2} align="center">
        <Media src="/higan/ampoule.jpg" alt={t('HIGAN — format ampoule 20 ml', 'HIGAN — 20 ml ampoule')} {...P} />
        <Media src="/higan/tshirt.jpg" alt={t('HIGAN — t-shirt brodé', 'HIGAN — embroidered t-shirt')} {...P} />
      </Row>
      <Row cols={2}>
        <Media src="/higan/shoot-1.jpg" alt={t('HIGAN — éditorial', 'HIGAN — editorial')} {...P} />
        <Media src="/higan/shoot-2.jpg" alt={t('HIGAN — éditorial', 'HIGAN — editorial')} {...P} />
      </Row>
    </ProjectPage>
  );
}
