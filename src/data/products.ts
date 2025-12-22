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
    tagline: 'GAMETRAQ leading Ai camera',
    summary:
      "GAMETRAQ leading Ai camera. Players spend more time at the club. Differentiating from other clubs. New revenue for clubs with digital services.",
    description:
      'GAMETRAQ brings broadcast-grade capture, AI-led tagging, and coach-ready dashboards into a compact ceiling-mounted unit. Automated rally segmentation, ball tracking, and player heatmaps let clubs personalise feedback for every skill level.',
  priceLabel: 'From €300/month or €3,000/year + shipping',
    heroGradient  : 'from-brand-blue/5 via-brand-cyan/5 to-brand-purple/10',
    image: '/assets/images/products/gametraq.png',
    features: [
      {
        title: 'Live Stream',
        description:
          'Stream matches directly to your club\'s YouTube channel and let the world watch the action in real time. Build your brand, showcase your players, and bring your community to life.'
      },
      {
        title: 'Boost Your Court Revenue',
        description:
          'With GAMETRAQ 5 installed on the court, clubs simply add 5–10 € to their court rental. Players get full AI video analytics included, and clubs earn an additional 600–750 € per month per court.'
      },
      {
        title: 'Smarter Coaching',
        description:
          'Give your coaches the power of AI. Use player analytics to design personalized drills that target each player\'s strengths and weaknesses, turning every training into real progress.'
      },
      {
        title: 'Highlights',
        description:
          'With GAMETRAQ 5, players can instantly watch their best rallies and funniest fails right on the venue\'s TV free for everyone. Whether it\'s a perfect lob or a dramatic dive, the highlights are saved straight from the court.'
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
    image: '/assets/images/products/shotgun.png',
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

