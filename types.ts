
export enum Region {
  SOUTH_OC = 'South OC',
  NORTH_OC = 'North OC',
  COASTAL = 'Coastal',
  INLAND = 'Inland'
}

export enum Category {
  FOOD_DRINK = 'Food & Drink',
  RETAIL = 'Retail',
  SERVICES = 'Services',
  HEALTH_WELLNESS = 'Health & Wellness',
  ARTS_CULTURE = 'Arts & Culture',
  TECHNOLOGY = 'Technology',
  EVENT = 'Events & Festivals'
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERN = 'Intern'
}

export enum ListingPackage {
  FREE = 'Free Posting',
  SILVER = 'Silver Package',
  GOLD = 'Gold Package'
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  expiryDate?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
  isVerified: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  price?: string;
  imageUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  salary?: string;
  postedAt: string;
  applicationMethod?: 'email' | 'link';
  applicationValue?: string;
  isFeatured?: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: Category;
  region: Region;
  city: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  imageUrl: string;
  deal?: Deal;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  events?: Event[];
  jobs?: Job[];
  package?: ListingPackage;
}

export interface AuthUser {
  email: string;
  isLoggedIn: boolean;
}
