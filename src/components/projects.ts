export type Project = {
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  image: string;
  link: string;
  /** Cover already contains text (logo, tagline): blur it more so it doesn't clash with the card title */
  softCover?: boolean;
  /** Intrinsic size of the cover, so it is never shown larger than it really is. */
  size: [number, number];
  /** Optional second image revealed on hover (e.g. the interface behind a brand cover). */
  hover?: string;
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
    title: same('Colosse'),
    subtitle: { fr: '2026 — Concept UX/UI, pilotage d’un tunnelier', en: '2026 — UX/UI concept, tunnel boring machine cockpit' },
    image: '/colosse/cover.jpg',
    size: [1667, 1250],
    hover: '/colosse/cover-hover.jpg',
    link: '/colosse',
    group: 'product',
  },
  {
    title: same('Dailies'),
    subtitle: { fr: '2026 — Concept SaaS, production vidéo IA', en: '2026 — SaaS concept, AI video production' },
    image: '/dailies/cover.jpg',
    size: [1667, 1250],
    hover: '/dailies/cover-hover.jpg',
    link: '/dailies',
    group: 'product',
  },
  {
    title: same('Élan'),
    subtitle: { fr: '2026 — Concept, montre connectée et iOS', en: '2026 — Concept, smartwatch and iOS' },
    image: '/elan/cover.jpg',
    size: [1667, 1250],
    hover: '/elan/cover-hover.jpg',
    link: '/elan',
    group: 'product',
  },
  {
    title: same('Foil'),
    subtitle: { fr: '2026 — Concept iOS, collection de cartes', en: '2026 — iOS concept, card collection' },
    image: '/foil/cover.jpg',
    size: [1667, 1250],
    hover: '/foil/cover-hover.jpg',
    link: '/foil',
    group: 'product',
  },
  {
    title: same('Serena'),
    subtitle: { fr: '2025 — Recherche, wireframes & UI', en: '2025 — Research, wireframes & UI' },
    image: '/serena-cover-v5.jpg',
    size: [1667, 1250],
    hover: '/serena-hover-v5.jpg',
    link: '/serena',
    group: 'product',
  },
  {
    title: same('Shu Uemura AI:tutor'),
    subtitle: { fr: '2025 — UI Design, coach beauté IA', en: '2025 — UI design, AI beauty tutor' },
    image: '/shu-cover-v5.jpg',
    size: [1667, 1250],
    hover: '/shu-hover-v5.jpg',
    link: '/shu-uemura',
    group: 'product',
  },
  {
    title: same('Soutrame'),
    subtitle: { fr: '2026 — Brand Experience & E-commerce Design', en: '2026 — Brand Experience & E-commerce Design' },
    image: '/soutrame-case/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/soutrame-case/cover-hover.jpg',
    link: '/soutrame-ecommerce',
    group: 'product',
  },
  {
    title: same('Hennessy X.O Second Skin'),
    subtitle: { fr: '2025 — UI Design, 3D', en: '2025 — UI design, 3D' },
    image: '/hennessy.webp',
    size: [3000, 1688],
    link: '/hennessy',
    group: 'product',
  },
  {
    title: same('HIGAN'),
    subtitle: { fr: '2026 — Design de flacon, 3D & direction artistique', en: '2026 — Bottle design, 3D & art direction' },
    image: '/higan/silhouette.jpg',
    size: [1797, 2248],
    link: '/higan',
    group: 'explorations',
  },
  {
    title: same('Post Archive Faction'),
    subtitle: { fr: '2025 — Direction créative, UI & motion', en: '2025 — Creative direction, UI & motion' },
    image: '/paf-cover-v2.jpg',
    size: [1667, 1250],
    link: '/post-archive-faction',
    group: 'explorations',
  },
  {
    title: { fr: 'Recherche visuelle IA', en: 'AI Visual Research' },
    subtitle: { fr: '2025 — Motion, direction artistique IA', en: '2025 — Motion, AI art direction' },
    image: '/f1-cover.webp',
    size: [1800, 1008],
    link: '/ai-research',
    group: 'explorations',
  },
];

export function nextProject(pathname: string): Project {
  const i = projects.findIndex((p) => p.link === pathname);
  return projects[(i + 1) % projects.length];
}
