
import { Region, Category, Business, JobType } from './types';

export const CITIES = [
  'Irvine', 'Newport Beach', 'Huntington Beach', 'Anaheim', 
  'Santa Ana', 'Laguna Beach', 'Dana Point', 'San Clemente',
  'Fullerton', 'Costa Mesa', 'Mission Viejo'
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Dana Point Surf Co.',
    category: Category.RETAIL,
    region: Region.COASTAL,
    city: 'Dana Point',
    description: 'Serving the OC surfing community since 1982. We provide custom boards, high-quality wetsuits, and expert local knowledge.',
    address: '34145 Pacific Coast Hwy, Dana Point, CA 92629',
    phone: '(949) 555-0123',
    website: 'https://danapointsurf.com',
    imageUrl: 'https://images.unsplash.com/photo-1502680399488-66046e96387d?auto=format&fit=crop&q=80&w=800',
    deal: {
      id: 'd1',
      title: '20% Off All Surfboards',
      description: 'Mention OC Thrive for a 20% discount on any new surfboard purchase.',
      expiryDate: 'Dec 31, 2025'
    },
    rating: 4.8,
    reviewCount: 124,
    reviews: [
      { id: 'r1', userName: 'Jake Miller', rating: 5, comment: 'Best surf shop in South OC. They really know their boards and the custom work is incredible.', timestamp: '2 days ago', isVerified: true },
      { id: 'r2', userName: 'Chloe S.', rating: 4, comment: 'Great selection of wetsuits. A bit pricey but the quality is top-tier.', timestamp: '1 week ago', isVerified: true },
      { id: 'r3', userName: 'Marcus T.', rating: 5, comment: 'Been coming here since I was a kid. Friendly staff and always helpful.', timestamp: '3 weeks ago', isVerified: true }
    ],
    events: [
      { id: 'e1', title: 'Morning Surf Clinic', description: 'Join our pros for a guided surf session and technique workshop at Salt Creek Beach.', date: '2025-06-12', time: '7:00 AM', price: 'Free' }
    ],
    jobs: [
      { id: 'j1', title: 'Surf Instructor', description: 'Experienced surfer needed for seasonal weekend clinics. Must be CPR certified.', type: JobType.PART_TIME, salary: '$25/hr', postedAt: '2025-05-01', isFeatured: true },
      { id: 'j2', title: 'Retail Associate', description: 'Passionate about surf culture? Join our retail team in Dana Point.', type: JobType.FULL_TIME, salary: '$18-20/hr', postedAt: '2025-05-05', isFeatured: false }
    ]
  },
  {
    id: '2',
    name: 'Newport Beach Grill',
    category: Category.FOOD_DRINK,
    region: Region.COASTAL,
    city: 'Newport Beach',
    description: 'Fresh, sustainable seafood with a breathtaking view of the harbor. Our chef specializes in Pacific fusion cuisine.',
    address: '2100 W Oceanfront, Newport Beach, CA 92663',
    phone: '(949) 555-0456',
    website: 'https://nbgrill.com',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    deal: {
      id: 'd2',
      title: 'Free Appetizer',
      description: 'Get one free signature appetizer with any two main course orders.',
      expiryDate: 'Nov 15, 2025'
    },
    rating: 4.6,
    reviewCount: 342,
    reviews: [
      { id: 'r4', userName: 'Eleanor Vance', rating: 5, comment: 'The view of the harbor at sunset is unmatched. Food was exquisite.', timestamp: 'Yesterday', isVerified: true },
      { id: 'r5', userName: 'Sam Rivers', rating: 4, comment: 'Solid seafood choices. The fusion dishes are daring and mostly work.', timestamp: '4 days ago', isVerified: false }
    ],
    events: [
      { id: 'e2', title: 'Wine & Harbor Sunsets', description: 'An exclusive tasting of Napa Valley whites paired with our chef\'s seafood bites.', date: '2025-07-20', time: '6:30 PM', price: '$45' }
    ],
    jobs: [
      { id: 'j3', title: 'Sous Chef', description: 'Seeking a creative sous chef with experience in Pacific fusion seafood.', type: JobType.FULL_TIME, salary: '$65k-75k', postedAt: '2025-05-10', isFeatured: false }
    ]
  },
  {
    id: '3',
    name: 'Irvine Tech Hub',
    category: Category.TECHNOLOGY,
    region: Region.INLAND,
    city: 'Irvine',
    description: 'Premier co-working space and business incubator for Orange County startups. High-speed internet and artisan coffee included.',
    address: '100 Innovation Dr, Irvine, CA 92617',
    phone: '(949) 555-0789',
    website: 'https://irvinetechhub.io',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 89,
    jobs: [
      { id: 'j4', title: 'Community Manager', description: 'Oversee daily operations and member engagement for our tech-focused community.', type: JobType.FULL_TIME, salary: '$55k-65k', postedAt: '2025-05-08', isFeatured: false }
    ]
  },
  {
    id: '5',
    name: 'Anaheim Brew Co.',
    category: Category.FOOD_DRINK,
    region: Region.NORTH_OC,
    city: 'Anaheim',
    description: 'Craft beer brewed right in the heart of Anaheim. Featuring 16 rotating taps and a dog-friendly patio.',
    address: '336 S Anaheim Blvd, Anaheim, CA 92805',
    phone: '(714) 555-1213',
    website: 'https://anaheimbrew.com',
    imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687ad32?auto=format&fit=crop&q=80&w=800',
    deal: {
      id: 'd3',
      title: '$10 Off First Visit',
      description: 'Save $10 on your first tab of $30 or more when you sign up for our newsletter.',
      expiryDate: 'Oct 01, 2025'
    },
    rating: 4.5,
    reviewCount: 212,
    reviews: [
      { id: 'r8', userName: 'Ben J.', rating: 4, comment: 'Great hazy IPAs and the patio vibe is perfect for a weekend afternoon.', timestamp: '2 days ago', isVerified: true }
    ],
    events: [
      { id: 'e3', title: 'Trivia Night: OC History', description: 'Test your knowledge of the county we love! Prizes for the top 3 teams.', date: '2025-05-15', time: '7:30 PM', price: 'Free' }
    ],
    jobs: [
      { id: 'j5', title: 'Taproom Server', description: 'Beer enthusiasts wanted for our busy Anaheim taproom. Must be 21+.', type: JobType.PART_TIME, salary: '$16/hr + tips', postedAt: '2025-05-12', isFeatured: false }
    ]
  },
  {
    id: '9',
    name: 'Pacific Arts Festival',
    category: Category.EVENT,
    region: Region.SOUTH_OC,
    city: 'Laguna Beach',
    description: 'A celebration of Southern California culture, featuring local artists, live music, and coastal food vendors.',
    address: 'Laguna Canyon Rd, Laguna Beach, CA 92651',
    phone: '(949) 555-9000',
    website: 'https://pacificartsoc.com',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviewCount: 450,
    events: [
      { id: 'e4', title: 'Laguna Summer Kickoff', description: 'The grand opening of the 2025 arts season with fireworks and live jazz.', date: '2025-06-01', time: '5:00 PM', price: '$25' }
    ]
  }
];
