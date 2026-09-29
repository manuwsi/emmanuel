export type Project = {
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  image: string;
  link: string;
  /** Cover already contains text (logo, tagline): blur it more so it doesn't clash with the card title */
  softCover?: boolean;
};

const same = (s: string) => ({ fr: s, en: s });

/**
 * Single source of truth for project order.
 * Used by the home carousel and by the "Next project" link on each case study.
 * Product / UI case studies come first.
 */
export const projects: Project[] = [
  {
    title: same('Shu Uemura AI:tutor'),
    subtitle: { fr: '2024 — UI Design, coach beauté IA', en: '2024 — UI design, AI beauty tutor' },
    image: '/shu-flow-01-cover.png',
    link: '/shu-uemura',
  },
  {
    title: same('Serena'),
    subtitle: { fr: '2024 — Recherche, wireframes & UI', en: '2024 — Research, wireframes & UI' },
    image: '/serena-cover.png',
    link: '/serena',
    softCover: true,
  },
  {
    title: same('Hennessy X.O Second Skin'),
    subtitle: { fr: '2025 — UI Design, 3D', en: '2025 — UI design, 3D' },
    image: '/hennessy.png',
    link: '/hennessy',
  },
  {
    title: same('Z_Lab'),
    subtitle: { fr: '2025 — Refonte de site, UI/UX', en: '2025 — Website redesign, UI/UX' },
    image: '/1.png',
    link: '/z_lab',
  },
  {
    title: same('Post Archive Faction'),
    subtitle: { fr: '2025 — Direction créative, UI & motion', en: '2025 — Creative direction, UI & motion' },
    image: '/PAF1.png',
    link: '/post-archive-faction',
  },
  {
    title: same('SPECTRE'),
    subtitle: { fr: '2025 — Design éditorial, direction artistique IA', en: '2025 — Editorial design, AI art direction' },
    image: '/spectre1.png',
    link: '/spectre',
  },
  {
    title: same('Aether'),
    subtitle: { fr: '2024 — Design system, jeu de tarot', en: '2024 — Design system, tarot deck' },
    image: '/AETHERCOVER.png',
    link: '/aether',
  },
  {
    title: { fr: 'Recherche visuelle IA', en: 'AI Visual Research' },
    subtitle: { fr: '2025 — Motion, direction artistique IA', en: '2025 — Motion, AI art direction' },
    image: '/f1-cover.png',
    link: '/ai-research',
  },
  {
    title: same('Pleated Assortment'),
    subtitle: { fr: '2024 — Direction créative, UI/UX', en: '2024 — Creative direction, UI/UX' },
    image: '/pleatedcover.png',
    link: '/pleated',
  },
];

export function nextProject(pathname: string): Project {
  const i = projects.findIndex((p) => p.link === pathname);
  return projects[(i + 1) % projects.length];
}
