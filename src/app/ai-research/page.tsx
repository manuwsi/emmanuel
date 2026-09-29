'use client';

import { ProjectPage, Media, Row } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

type Piece = { src: string; title: string; caption: string; width: number; height: number; video?: boolean };

function Captioned({ p }: { p: Piece }) {
  return (
    <figure className="space-y-4">
      <Media src={p.src} alt={p.title} width={p.width} height={p.height} video={p.video} />
      <figcaption className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <span className="md:col-span-4 text-[0.65rem] uppercase tracking-widest text-neutral-400">{p.title}</span>
        <span className="md:col-span-8 text-xs text-gray-500 leading-relaxed max-w-xl">{p.caption}</span>
      </figcaption>
    </figure>
  );
}

export default function Page() {
  const t = useT();

  const f1: Piece = {
    src: '/f1-aesthetic.mp4', video: true, width: 1800, height: 1008, title: 'F1 Aesthetic',
    caption: t(
      'Une monoplace vue à travers un prisme thermique et radiographique, entre transparence et chaleur pure.',
      'A race car seen through a thermal, X-ray-like lens, between transparency and pure heat.'
    ),
  };
  const liquid: Piece = {
    src: '/ai-underwater.mp4', video: true, width: 1936, height: 1080, title: 'Liquid Figure',
    caption: t(
      'Une silhouette prise dans une matière liquide, quelque part entre le métal et l’eau.',
      'A figure caught in a liquid material, somewhere between metal and water.'
    ),
  };
  const crowd: Piece[] = [
    {
      src: '/ai-crowd-yellow.mp4', video: true, width: 1620, height: 1080, title: 'Crowd Study — Yellow',
      caption: t(
        'Une foule figée dans un aplat de couleur, à mi-chemin entre la peinture et le glitch.',
        'A crowd frozen in a flat field of colour, halfway between painting and glitch.'
      ),
    },
    {
      src: '/ai-crowd-negative.mp4', video: true, width: 1936, height: 1080, title: 'Crowd Study — Negative',
      caption: t('La même idée de foule, inversée, presque spectrale.', 'The same crowd idea, inverted, almost spectral.'),
    },
  ];
  const doubleExp: Piece = {
    src: '/ai-double-exposure.mp4', video: true, width: 1936, height: 1080, title: 'Double Exposure',
    caption: t('Un portrait fondu dans le tissu urbain d’une ville la nuit.', 'A portrait blended into the fabric of a city at night.'),
  };

  return (
    <ProjectPage
      title={t('Recherche visuelle IA', 'AI Visual Research')}
      subtitle={t('Exploration visuelle, IA & 3D', 'Visual exploration, AI & 3D')}
      meta={{
        year: '2025',
        context: t('Recherche personnelle', 'Personal research'),
        role: t('Direction artistique, motion', 'Art direction, motion'),
        tools: 'Midjourney, Runway, Kling, Reve, Blender, After Effects',
      }}
      intro={t(
        <p>
          Un espace de recherche personnelle où je teste ce que l&apos;IA et la 3D peuvent
          apporter à l&apos;image au-delà du réalisme : matière, couleur, distorsion,
          composition. Chaque pièce part d&apos;une question simple, comment représenter
          autrement la chaleur, la foule, la matière, le mouvement.
        </p>,
        <p>
          A personal research space where I test what AI and 3D can bring to the image beyond
          realism: material, colour, distortion, composition. Each piece starts from a simple
          question: how else could we show heat, a crowd, matter, movement?
        </p>
      )}
      next={{ href: '/pleated', title: 'Pleated Assortment' }}
    >
      <div className="space-y-20 md:space-y-28">
        <Captioned p={f1} />
        <Captioned p={liquid} />
        <Row cols={2}>
          {crowd.map((p) => (
            <Captioned key={p.src} p={p} />
          ))}
        </Row>
        <Captioned p={doubleExp} />
        <figure className="space-y-4 max-w-2xl mx-auto">
          <Media src="/ai-red-figure.png" alt="Material Study" width={1920} height={2400} />
          <figcaption className="text-center space-y-1">
            <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">Material Study</span>
            <span className="block text-xs text-gray-500">
              {t('Une étude de matière : laque rouge, courbes et lumière.', 'A material study: red lacquer, curves and light.')}
            </span>
          </figcaption>
        </figure>
      </div>
    </ProjectPage>
  );
}
