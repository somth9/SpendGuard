export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  settings: UserSettings;
  stats: UserStats;
}

export interface UserSettings {
  impulseThreshold: number;
  cooldownHours: 24 | 48 | 72;
  notificationsEnabled: boolean;
  monthlyBudget?: number;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPointsEarned: number;
  currentLevel: number;
  totalSaved: number;
  totalSpent: number;
  adhdTaxTotal: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  name: string;
  price: number;
  category: PurchaseCategory;
  url?: string;
  notes?: string;
  imageUrl?: string;
  addedAt: Date;
  cooldownEndsAt: Date;
  status: WishlistStatus;
  moodTag?: MoodTag;
  contextTag?: string;
  purchasedAt?: Date;
  dismissedAt?: Date;
  dismissReason?: string;
}

export type WishlistStatus = 
  | 'cooling_down'
  | 'ready_to_review'
  | 'purchased'
  | 'dismissed';

export interface Purchase {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: PurchaseCategory;
  date: Date;
  wasImpulse: boolean;
  moodTag?: MoodTag;
  contextTag?: string;
  notes?: string;
  receiptUrl?: string;
  tags?: string[];
}

export type PurchaseCategory = 
  | 'electronics'
  | 'clothing'
  | 'food'
  | 'entertainment'
  | 'home'
  | 'transportation'
  | 'health'
  | 'subscription'
  | 'other';

export type MoodTag = 
  | 'happy'
  | 'stressed'
  | 'bored'
  | 'sad'
  | 'frustrated'
  | 'excited'
  | 'anxious'
  | 'neutral';

export interface ADHDTaxItem {
  id: string;
  userId: string;
  type: ADHDTaxType;
  amount: number;
  description: string;
  date: Date;
  category?: PurchaseCategory;
  isPrevented?: boolean;
  notes?: string;
}

export type ADHDTaxType = 
  | 'late_fee'
  | 'unused_subscription'
  | 'impulse_return'
  | 'overdraft'
  | 'duplicate'
  | 'expedited_shipping'
  | 'lost_item'
  | 'forgotten_appointment'
  | 'other';

export interface Reward {
  id: string;
  userId: string;
  type: RewardType;
  points?: number;
  badgeId?: string;
  earnedAt: Date;
  description: string;
  source: string;
}

export type RewardType = 'points' | 'badge' | 'level_up';

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  iconEmoji: string;
  category: BadgeCategory;
  requirement: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export type BadgeCategory = 
  | 'streak'
  | 'savings'
  | 'consistency'
  | 'milestone'
  | 'special';

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first-save',
    name: 'First Save',
    description: 'Dismissed your first impulse purchase',
    iconUrl: '/badges/first-save.png',
    iconEmoji: '💰',
    category: 'milestone',
    requirement: 'Dismiss 1 wishlist item',
    points: 50,
    rarity: 'common'
  },
  {
    id: '3-day-streak',
    name: '3-Day Streak',
    description: 'Three days without impulse purchases',
    iconUrl: '/badges/3-day-streak.png',
    iconEmoji: '🔥',
    category: 'streak',
    requirement: '3-day streak',
    points: 100,
    rarity: 'common'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'A full week of mindful spending',
    iconUrl: '/badges/week-warrior.png',
    iconEmoji: '🏆',
    category: 'streak',
    requirement: '7-day streak',
    points: 250,
    rarity: 'uncommon'
  },
  {
    id: 'budget-ninja',
    name: 'Budget Ninja',
    description: 'Stayed under budget for a month',
    iconUrl: '/badges/budget-ninja.png',
    iconEmoji: '🥷',
    category: 'savings',
    requirement: 'Stay under monthly budget',
    points: 500,
    rarity: 'rare'
  },
  {
    id: 'saver-supreme',
    name: 'Saver Supreme',
    description: 'Saved $500 by dismissing impulses',
    iconUrl: '/badges/saver-supreme.png',
    iconEmoji: '👑',
    category: 'savings',
    requirement: 'Save $500 total',
    points: 1000,
    rarity: 'epic'
  }
];

export interface SpendingPattern {
  userId: string;
  patterns: {
    byHour: Record<number, number>;
    byDay: Record<string, number>;
    byCategory: Record<PurchaseCategory, number>;
    byMood: Record<MoodTag, number>;
    byContext: Record<string, number>;
  };
  triggers: PatternTrigger[];
  lastAnalyzed: Date;
}

export interface PatternTrigger {
  id: string;
  type: 'time' | 'mood' | 'context' | 'category';
  description: string;
  confidence: number;
  suggestion: string;
  occurrences: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    dataReferences?: string[];
    chartData?: any;
    actionLinks?: ActionLink[];
  };
}

export interface ActionLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  data?: any;
}

export type NotificationType = 
  | 'cooldown_complete'
  | 'streak_milestone'
  | 'badge_unlocked'
  | 'budget_warning'
  | 'weekly_recap'
  | 'adhd_tax_insight'
  | 'motivational';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export const userConverter = {
  toFirestore: (user: User) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    } as User;
  }
};
