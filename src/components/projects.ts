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
    subtitle: { fr: '2026 — Cockpit de tunnelier', en: '2026 — Tunnel boring machine cockpit' },
    image: '/colosse/cover-v4.jpg',
    size: [1667, 1250],
    hover: '/colosse/cover.jpg',
    link: '/colosse',
    group: 'featured',
  },
  {
    title: same('Proxy'),
    subtitle: { fr: '2026 — Agent IA personnel', en: '2026 — Personal AI agent' },
    image: '/proxy/cover-v4.jpg',
    size: [1667, 1250],
    hover: '/proxy/cover-photo-hover-v3.jpg',
    link: '/proxy',
    group: 'featured',
  },
  {
    title: same('Élan'),
    subtitle: { fr: '2026 — Montre connectée et iOS', en: '2026 — Smartwatch and iOS' },
    image: '/elan/cover-v4.jpg',
    size: [1667, 1250],
    hover: '/elan/cover.jpg',
    link: '/elan',
    group: 'featured',
  },
  {
    title: same('Soutrame'),
    subtitle: { fr: '2026 — E-commerce', en: '2026 — E-commerce' },
    image: '/soutrame-case/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/soutrame-case/cover-hover.jpg',
    link: '/soutrame-ecommerce',
    group: 'featured',
  },
  {
    title: same('Shu Uemura AI:tutor'),
    subtitle: { fr: '2025 — Coach beauté IA, OKCC', en: '2025 — AI beauty tutor, OKCC' },
    image: '/shu-cover-v7.jpg',
    size: [1667, 1250],
    link: '/shu-uemura',
    group: 'more',
  },
  {
    title: same('Hennessy X.O Second Skin'),
    subtitle: { fr: '2025 — UI et 3D, OKCC', en: '2025 — UI and 3D, OKCC' },
    image: '/hennessy.webp',
    size: [3000, 1688],
    link: '/hennessy',
    group: 'more',
  },
  {
    title: same('Dailies'),
    subtitle: { fr: '2026 — Production vidéo IA', en: '2026 — AI video production' },
    image: '/dailies/cover.jpg',
    size: [1667, 1250],
    hover: '/dailies/cover-hover.jpg',
    link: '/dailies',
    group: 'more',
  },
  {
    title: same('Foil'),
    subtitle: { fr: '2026 — Collection de cartes, iOS', en: '2026 — Card collection, iOS' },
    image: '/foil/cover-v2.jpg',
    size: [1667, 1250],
    hover: '/foil/cover-hover-v2.jpg',
    link: '/foil',
    group: 'more',
  },
  {
    title: same('Serena'),
    subtitle: { fr: '2025 — Recherche et UI', en: '2025 — Research and UI' },
    image: '/serena-cover-v7.jpg',
    size: [1667, 1250],
    link: '/serena',
    group: 'more',
  },
  {
    title: same('HIGAN'),
    subtitle: { fr: '2026 — Flacon, 3D', en: '2026 — Bottle, 3D' },
    image: '/higan/silhouette.jpg',
    size: [1797, 2248],
    link: '/higan',
    group: 'explorations',
  },
  {
    title: same('Post Archive Faction'),
    subtitle: { fr: '2025 — Direction créative', en: '2025 — Creative direction' },
    image: '/paf-cover-v2.jpg',
    size: [1667, 1250],
    link: '/post-archive-faction',
    group: 'explorations',
  },
  {
    title: { fr: 'Recherche visuelle IA', en: 'AI Visual Research' },
    subtitle: { fr: '2025 — Motion IA', en: '2025 — AI motion' },
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
