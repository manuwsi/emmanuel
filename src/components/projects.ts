export type Project = {
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  image: string;
  link: string;
  /** Cover already contains text (logo, tagline): blur it more so it doesn't clash with the card title */
  softCover?: boolean;
  group: 'product' | 'explorations';
};

const same = (s: string) => ({ fr: s, en: s });

/**
 * Single source of truth for project order.
 * Used by the home carousel and by the "Next project" link on each case study.
 * Product design case studies first, then visual explorations (OKCC AI projects last).
 */
export const projects: Project[] = [
  {
    title: same('Serena'),
    subtitle: { fr: '2025 — Recherche, wireframes & UI', en: '2025 — Research, wireframes & UI' },
    image: '/serena-cover.png',
    link: '/serena',
    group: 'product',
    softCover: true,
  },
  {
    title: same('Shu Uemura AI:tutor'),
    subtitle: { fr: '2025 — UI Design, coach beauté IA', en: '2025 — UI design, AI beauty tutor' },
    image: '/shu-flow-01-cover.png',
    link: '/shu-uemura',
    group: 'product',
  },
  {
    title: same('Hennessy X.O Second Skin'),
    subtitle: { fr: '2025 — UI Design, 3D', en: '2025 — UI design, 3D' },
    image: '/hennessy.png',
    link: '/hennessy',
    group: 'product',
  },
  {
    title: same('Z_Lab'),
    subtitle: { fr: '2025 — Refonte de site, UI/UX', en: '2025 — Website redesign, UI/UX' },
    image: '/1.png',
    link: '/z_lab',
    group: 'product',
  },
  {
    title: same('HIGAN'),
    subtitle: { fr: '2026 — Design de flacon, 3D & direction artistique', en: '2026 — Bottle design, 3D & art direction' },
    image: '/higan/silhouette.jpg',
    link: '/higan',
    group: 'explorations',
  },
  {
    title: same('Post Archive Faction'),
    subtitle: { fr: '2025 — Direction créative, UI & motion', en: '2025 — Creative direction, UI & motion' },
    image: '/PAF1.png',
    link: '/post-archive-faction',
    group: 'explorations',
  },
  {
    title: same('Aether'),
    subtitle: { fr: '2024 — Design system, jeu de tarot', en: '2024 — Design system, tarot deck' },
    image: '/AETHERCOVER.png',
    link: '/aether',
    group: 'explorations',
  },
  {
    title: same('SPECTRE'),
    subtitle: { fr: '2025 — Design éditorial, direction artistique IA', en: '2025 — Editorial design, AI art direction' },
    image: '/spectre1.png',
    link: '/spectre',
    group: 'explorations',
  },
  {
    title: { fr: 'Recherche visuelle IA', en: 'AI Visual Research' },
    subtitle: { fr: '2025 — Motion, direction artistique IA', en: '2025 — Motion, AI art direction' },
    image: '/f1-cover.png',
    link: '/ai-research',
    group: 'explorations',
  },
];

export function nextProject(pathname: string): Project {
  const i = projects.findIndex((p) => p.link === pathname);
  return projects[(i + 1) % projects.length];
}
