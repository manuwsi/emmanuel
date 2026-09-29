'use client';

import { ProjectPage, Media, Row } from '@/components/project/ProjectPage';

type Piece = { src: string; title: string; caption: string; width: number; height: number; video?: boolean };

const pieces: Piece[] = [
  { src: '/f1-aesthetic.mp4', video: true, width: 1800, height: 1008, title: 'F1 Aesthetic', caption: 'Une monoplace vue à travers un prisme thermique et radiographique, entre transparence et chaleur pure.' },
  { src: '/ai-underwater.mp4', video: true, width: 1936, height: 1080, title: 'Liquid Figure', caption: 'Une silhouette prise dans une matière liquide, quelque part entre le métal et l’eau.' },
  { src: '/ai-double-exposure.mp4', video: true, width: 1936, height: 1080, title: 'Double Exposure', caption: 'Un portrait fondu dans le tissu urbain d’une ville la nuit.' },
];

const crowd: Piece[] = [
  { src: '/ai-crowd-yellow.mp4', video: true, width: 1620, height: 1080, title: 'Crowd Study — Yellow', caption: 'Une foule figée dans un aplat de couleur, à mi-chemin entre la peinture et le glitch.' },
  { src: '/ai-crowd-negative.mp4', video: true, width: 1936, height: 1080, title: 'Crowd Study — Negative', caption: 'La même idée de foule, inversée, presque spectrale.' },
];

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
  return (
    <ProjectPage
      title="AI Visual Research"
      subtitle="Exploration visuelle, IA & 3D"
      meta={[
        { label: 'Année', value: '2025' },
        { label: 'Contexte', value: 'Recherche personnelle' },
        { label: 'Rôle', value: 'Direction artistique, motion' },
        { label: 'Outils', value: 'Midjourney, Runway, Kling, Reve, Blender, After Effects' },
      ]}
      intro={
        <p>
          Un espace de recherche personnelle où je teste ce que l&apos;IA et la 3D peuvent
          apporter à l&apos;image au-delà du réalisme : matière, couleur, distorsion,
          composition. Chaque pièce part d&apos;une question simple, comment représenter
          autrement la chaleur, la foule, la matière, le mouvement.
        </p>
      }
      next={{ href: '/pleated', title: 'Pleated Assortment' }}
    >
      <div className="space-y-20 md:space-y-28">
        <Captioned p={pieces[0]} />
        <Captioned p={pieces[1]} />
        <Row cols={2}>
          {crowd.map((p) => (
            <Captioned key={p.src} p={p} />
          ))}
        </Row>
        <Captioned p={pieces[2]} />
        <figure className="space-y-4 max-w-2xl mx-auto">
          <Media src="/ai-red-figure.png" alt="Material Study" width={1920} height={2400} />
          <figcaption className="text-center space-y-1">
            <span className="block text-[0.65rem] uppercase tracking-widest text-neutral-400">Material Study</span>
            <span className="block text-xs text-gray-500">Une étude de matière : laque rouge, courbes et lumière.</span>
          </figcaption>
        </figure>
      </div>
    </ProjectPage>
  );
}
