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
  /** featured: the four flagship case studies · more: client work and other concepts · explorations: visual work */
  group: 'featured' | 'more' | 'explorations';
};

const same = (s: string) => ({ fr: s, en: s });

/**
 * Single source of truth for project order.
 * Used by the home carousel and by the "Next project" link on each case study.
 * Four flagship case studies first (complex tool, agentic AI, consumer, brand), then client work and
 * other concepts, then visual explorations.
 */
export const projects: Project[] = [
  {
    title: same('Colosse'),
    subtitle: { fr: '2026 — Interface métier, pilotage d’un tunnelier', en: '2026 — Industrial interface, tunnel boring machine cockpit' },
    image: '/colosse/cover-v3.jpg',
    size: [1667, 1250],
    hover: '/colosse/cover.jpg',
    link: '/colosse',
    group: 'featured',
  },
  {
    title: same('Proxy'),
    subtitle: { fr: '2026 — IA agentique, superviser un agent personnel', en: '2026 — Agentic AI, supervising a personal agent' },
    image: '/proxy/cover-photo-v3.jpg',
    size: [1667, 1250],
    hover: '/proxy/cover-photo-hover-v3.jpg',
    link: '/proxy',
    group: 'featured',
  },
  {
    title: same('Élan'),
    subtitle: { fr: '2026 — Grand public, montre connectée et iOS', en: '2026 — Consumer, smartwatch and iOS' },
    image: '/elan/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/elan/cover.jpg',
    link: '/elan',
    group: 'featured',
  },
  {
    title: same('Soutrame'),
    subtitle: { fr: '2026 — Marque et e-commerce, site en ligne', en: '2026 — Brand and e-commerce, live site' },
    image: '/soutrame-case/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/soutrame-case/cover-hover.jpg',
    link: '/soutrame-ecommerce',
    group: 'featured',
  },
  {
    title: same('Shu Uemura AI:tutor'),
    subtitle: { fr: '2025 — OKCC × Shu Uemura, coach beauté IA', en: '2025 — OKCC × Shu Uemura, AI beauty tutor' },
    image: '/shu-cover-v7.jpg',
    size: [1667, 1250],
    link: '/shu-uemura',
    group: 'more',
  },
  {
    title: same('Hennessy X.O Second Skin'),
    subtitle: { fr: '2025 — OKCC × Hennessy, UI et 3D', en: '2025 — OKCC × Hennessy, UI and 3D' },
    image: '/hennessy.webp',
    size: [3000, 1688],
    link: '/hennessy',
    group: 'more',
  },
  {
    title: same('Dailies'),
    subtitle: { fr: '2026 — Concept SaaS, production vidéo IA', en: '2026 — SaaS concept, AI video production' },
    image: '/dailies/cover.jpg',
    size: [1667, 1250],
    hover: '/dailies/cover-hover.jpg',
    link: '/dailies',
    group: 'more',
  },
  {
    title: same('Foil'),
    subtitle: { fr: '2026 — Concept iOS, collection de cartes', en: '2026 — iOS concept, card collection' },
    image: '/foil/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/foil/cover-hover-v2.jpg',
    link: '/foil',
    group: 'more',
  },
  {
    title: same('Serena'),
    subtitle: { fr: '2025 — Projet d’école, recherche et UI', en: '2025 — School project, research and UI' },
    image: '/serena-cover-v7.jpg',
    size: [1667, 1250],
    link: '/serena',
    group: 'more',
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
