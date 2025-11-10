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
    tagline: 'Tool for all levels of padel players and venues.',
    summary:
      "Beginners enjoy GAMETRAQ for the stats and added fun in every game. Intermediate players track progression with objective metrics. Pros analyse opponents strengths and weaknesses for a decisive edge.",
    description:
      'GAMETRAQ brings broadcast-grade capture, AI-led tagging, and coach-ready dashboards into a compact ceiling-mounted unit. Automated rally segmentation, ball tracking, and player heatmaps let clubs personalise feedback for every skill level.',
  priceLabel: 'From €300/month or €3,000/year + shipping',
    heroGradient  : 'from-brand-blue/5 via-brand-cyan/5 to-brand-purple/10',
    image: '/assets/images/gametraq.png',
    features: [
      {
        title: 'AI INSIGHTS',
        description:
          'Meter counting, ball possession, error shots, time in transit, and zone maps/heat-maps delivered for every game.'
      },
      {
        title: 'YOUTUBE LIVESTREAMING',
        description:
          'We set up live streaming so you can broadcast events and tournaments to your own YouTube channel—just like the pros.'
      },
      {
        title: 'SAVE BALL RALLY BUTTON',
        description:
          'An included TV device converts your screen into a highlight hub with instant playback directly from the courts.'
      },
      {
        title: 'OVERVIEW SALES',
        description:
          'Add and monitor a new source of income for your club and watch your revenue grow.'
      }
    ],
    stats: [
      { label: 'Resolution', value: '4K @ 90FPS' },
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
      'Beginner engagement through gamified stats',
      'Player development programs with measurable milestones'
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
  priceLabel: 'One-time payment €3,450 + shipping',
    heroGradient: 'from-brand-pink/5 via-brand-purple/5 to-brand-blue/10',
    image: '/assets/images/shotgun.png',
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

