export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductStat {
  label: string;
  value: string;
}

export interface Product {
  slug: 'gametraq' | 'shotgun';
  name: string;
  tagline: string;
  summary: string;
  description: string;
  priceLabel: string;
  priceEnvKey: string;
  heroGradient: string;
  image: string;
  features: ProductFeature[];
  stats: ProductStat[];
  technicalHighlights: string[];
  useCases: string[];
}

export const products: Product[] = [
  {
    slug: 'gametraq',
    name: 'GAMETRAQ',
    tagline: 'Tool for all strategies of padel players.',
    summary:
      "Beginners enjoy the stats for added fun in every game. Intermediate players track progression with objective metrics. Pros analyse opponents' strengths and weaknesses for a decisive edge.",
    description:
      'GAMETRAQ brings broadcast-grade capture, AI-led tagging, and coach-ready dashboards into a compact ceiling-mounted unit. Automated rally segmentation, ball tracking, and player heatmaps let clubs personalise feedback for every skill level.',
    priceLabel: 'Get a price estimate in € + shipping',
    priceEnvKey: 'VITE_STRIPE_PRICE_GAMETRAQ',
    heroGradient: 'from-brand-blue/5 via-brand-cyan/5 to-brand-purple/10',
    image: '/assets/gametraq.png',
    features: [
      {
        title: 'Complete match intelligence',
        description:
          'AI-generated insights surface shot tempo, positional dominance, and clutch moments without manual editing.'
      },
      {
        title: 'Instant sharing',
        description:
          'Schedule highlights for players, coaches, or fans with one-click exports to social channels and club apps.'
      },
    ],
    stats: [
      { label: 'Resolution', value: '4K @ 60FPS' },
      { label: 'Latency', value: '< 150 ms live feed' },
      { label: 'Compute', value: 'Edge AI module with 12 TOPS' }
    ],
    technicalHighlights: [
      'Dual-band Wi-Fi 6 and gigabit ethernet for resilient uplink',
      'Edge inference with automatic firmware updates over-the-air',
      'Secure club dashboard with role-based access control',
      'Native integrations planned for Playtomic and MATCHi'
    ],
    useCases: [
      'Tactical preparation for pro teams and academies',
      'Player development programs with measurable milestones',
      'Broadcast-style match packages for fans and sponsors'
    ]
  },
  {
    slug: 'shotgun',
    name: 'SHOTGUN',
    tagline: 'An adaptive padel ball machine built for modern coaching.',
    summary:
      'SHOTGUN delivers programmable pace, spin, and trajectories so coaches can run precision sessions or let players train solo with dynamic drills.',
    description:
      'Designed with coaches, SHOTGUN mixes power and finesse. Deliver lobs, volleys, and custom trajectories with 120-ball capacity, AI tempo tracking, and battery or mains operation. Everything is controlled from a rugged, glove-friendly touchscreen.',
    priceLabel: 'Order starting at 2,950€ + shipping',
    priceEnvKey: 'VITE_STRIPE_PRICE_SHOTGUN',
    heroGradient: 'from-brand-pink/5 via-brand-purple/5 to-brand-blue/10',
    image: '/assets/shotgun.png',
    features: [
      {
        title: 'Adaptive rhythm',
        description: 'Machine vision tracks player positioning and adjusts feed tempo to keep drills flowing.'
      },
      {
        title: 'Dynamic spin control',
        description: 'Dial in side and top spin with +/- 12 deg oscillation and repeatable presets for every shot.'
      },
    ],
    stats: [
      { label: 'Ball Capacity', value: '180 balls' },
      { label: 'Feed Rate', value: '20-70 balls per minute' },
      { label: 'Battery', value: 'Up to 6 hours' }
    ],
    technicalHighlights: [
      'Carbon fiber and aluminum construction for transportability',
      'Hot-swappable lithium battery pack with 90-minute quick charge',
      'Weather-resistant IP54 chassis for outdoor courts',
      'USB-C and Bluetooth LE for firmware updates and connectivity'
    ],
    useCases: [
      'High-intensity team drills with variable shot sequences',
      'Beginner onboarding with gentle auto-coach mode',
      'Club rental programs to monetise off-peak court time'
    ]
  }
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);






