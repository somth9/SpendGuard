"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { 
  WishlistItem, 
  Purchase, 
  ADHDTaxItem, 
  Reward, 
  UserStats,
  UserSettings,
  WishlistStatus,
  PurchaseCategory,
  MoodTag,
  ADHDTaxType
} from '../types/models';

interface SpendGuardContextType {
  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'userId' | 'addedAt' | 'cooldownEndsAt' | 'status'>) => Promise<void>;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  purchaseWishlistItem: (id: string) => Promise<void>;
  dismissWishlistItem: (id: string, reason?: string) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  
  // Purchases/History
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'userId' | 'date'>) => Promise<void>;
  
  // User Stats
  userStats: UserStats;
  updateUserStats: (updates: Partial<UserStats>) => Promise<void>;
  
  // User Settings
  userSettings: UserSettings;
  updateUserSettings: (updates: Partial<UserSettings>) => Promise<void>;
  
  // ADHD Tax
  adhdTaxItems: ADHDTaxItem[];
  addADHDTaxItem: (item: Omit<ADHDTaxItem, 'id' | 'userId' | 'date'>) => Promise<void>;
  deleteADHDTaxItem: (id: string) => Promise<void>;
  
  // Rewards
  rewards: Reward[];
  badges: string[];
  awardPoints: (points: number, description: string, source: string) => Promise<void>;
  awardBadge: (badgeId: string, description: string) => Promise<void>;
  
  // Loading state
  loading: boolean;
  refreshData: () => Promise<void>;
}

const SpendGuardContext = createContext<SpendGuardContextType | undefined>(undefined);

export function SpendGuardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [adhdTaxItems, setADHDTaxItems] = useState<ADHDTaxItem[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalPointsEarned: 0,
    currentLevel: 1,
    totalSaved: 0,
    totalSpent: 0,
    adhdTaxTotal: 0
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    impulseThreshold: 50,
    cooldownHours: 48,
    notificationsEnabled: true,
    monthlyBudget: 1000,
    currency: 'USD',
    theme: 'light',
    language: 'en'
  });
  const [loading, setLoading] = useState(true);

  // Helper function to convert Firestore Timestamps to Dates
  const convertTimestampsToDates = (data: any): any => {
    if (!data) return data;
    const result = { ...data };
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Timestamp) {
        result[key] = result[key].toDate();
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = convertTimestampsToDates(result[key]);
      }
    });
    return result;
  };

  // Load all user data
  const loadUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load user stats
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.stats) setUserStats(userData.stats);
        if (userData.settings) setUserSettings(userData.settings);
        if (userData.badges) setBadges(userData.badges);
      } else {
        // Create initial user document
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          createdAt: serverTimestamp(),
          stats: userStats,
          settings: userSettings,
          badges: []
        });
      }

      // Load wishlist items
      const wishlistQuery = query(
        collection(db, 'wishlist'),
        where('userId', '==', user.uid),
        orderBy('addedAt', 'desc')
      );
      const wishlistSnapshot = await getDocs(wishlistQuery);
      const wishlistData = wishlistSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        } as WishlistItem;
      });
      setWishlistItems(wishlistData);

      // Load purchases
      const purchasesQuery = query(
        collection(db, 'purchases'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const purchasesSnapshot = await getDocs(purchasesQuery);
      const purchasesData = purchasesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        } as Purchase;
      });
      setPurchases(purchasesData);

      // Load ADHD Tax items
      const adhdTaxQuery = query(
        collection(db, 'adhdTax'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const adhdTaxSnapshot = await getDocs(adhdTaxQuery);
      const adhdTaxData = adhdTaxSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        } as ADHDTaxItem;
      });
      setADHDTaxItems(adhdTaxData);

      // Load rewards
      const rewardsQuery = query(
        collection(db, 'rewards'),
        where('userId', '==', user.uid),
        orderBy('earnedAt', 'desc')
      );
      const rewardsSnapshot = await getDocs(rewardsQuery);
      const rewardsData = rewardsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        } as Reward;
      });
      setRewards(rewardsData);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Check and update cooldown status for wishlist items
  useEffect(() => {
    const checkCooldowns = () => {
      const now = new Date();
      wishlistItems.forEach(async (item) => {
        if (item.status === 'cooling_down' && item.cooldownEndsAt <= now) {
          await updateWishlistItem(item.id, { status: 'ready_to_review' });
        }
      });
    };

    const interval = setInterval(checkCooldowns, 60000); // Check every minute
    checkCooldowns(); // Check immediately

    return () => clearInterval(interval);
  }, [wishlistItems]);

  // Wishlist functions
  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'userId' | 'addedAt' | 'cooldownEndsAt' | 'status'>) => {
    if (!user) return;

    const addedAt = new Date();
    const cooldownEndsAt = new Date(addedAt.getTime() + userSettings.cooldownHours * 60 * 60 * 1000);

    const newItem = {
      ...item,
      userId: user.uid,
      addedAt,
      cooldownEndsAt,
      status: 'cooling_down' as WishlistStatus
    };

    const docRef = await addDoc(collection(db, 'wishlist'), {
      ...newItem,
      addedAt: Timestamp.fromDate(addedAt),
      cooldownEndsAt: Timestamp.fromDate(cooldownEndsAt)
    });

    setWishlistItems(prev => [{ ...newItem, id: docRef.id }, ...prev]);

    // Award points for adding to wishlist (self-control)
    await awardPoints(5, 'Added item to wishlist', 'wishlist_add');
  };

  const updateWishlistItem = async (id: string, updates: Partial<WishlistItem>) => {
    if (!user) return;

    const docRef = doc(db, 'wishlist', id);
    
    // Convert Date objects to Timestamps
    const firestoreUpdates: any = { ...updates };
    if (updates.cooldownEndsAt) {
      firestoreUpdates.cooldownEndsAt = Timestamp.fromDate(updates.cooldownEndsAt);
    }
    if (updates.purchasedAt) {
      firestoreUpdates.purchasedAt = Timestamp.fromDate(updates.purchasedAt);
    }
    if (updates.dismissedAt) {
      firestoreUpdates.dismissedAt = Timestamp.fromDate(updates.dismissedAt);
    }

    await updateDoc(docRef, firestoreUpdates);

    setWishlistItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const purchaseWishlistItem = async (id: string) => {
    if (!user) return;

    const item = wishlistItems.find(i => i.id === id);
    if (!item) return;

    // Update wishlist item status
    const purchasedAt = new Date();
    await updateWishlistItem(id, { 
      status: 'purchased', 
      purchasedAt 
    });

    // Add to purchases
    await addPurchase({
      name: item.name,
      amount: item.price,
      category: item.category,
      wasImpulse: true,
      moodTag: item.moodTag,
      contextTag: item.contextTag,
      notes: item.notes
    });

    // Update stats
    await updateUserStats({
      totalSpent: userStats.totalSpent + item.price,
      currentStreak: 0 // Reset streak on impulse purchase
    });

    // Award points for waiting through cooldown
    await awardPoints(20, 'Completed cooldown before purchase', 'cooldown_complete');
  };

  const dismissWishlistItem = async (id: string, reason?: string) => {
    if (!user) return;

    const item = wishlistItems.find(i => i.id === id);
    if (!item) return;

    const dismissedAt = new Date();
    await updateWishlistItem(id, { 
      status: 'dismissed', 
      dismissedAt,
      dismissReason: reason 
    });

    // Update stats - money saved!
    await updateUserStats({
      totalSaved: userStats.totalSaved + item.price,
      currentStreak: userStats.currentStreak + 1,
      longestStreak: Math.max(userStats.longestStreak, userStats.currentStreak + 1)
    });

    // Award points for resisting impulse
    await awardPoints(50, `Dismissed "${item.name}" and saved $${item.price}`, 'wishlist_dismiss');

    // Check for badges
    const newTotalSaved = userStats.totalSaved + item.price;
    if (newTotalSaved >= 500 && userStats.totalSaved < 500) {
      await awardBadge('saver-supreme', 'Saved $500 by dismissing impulses');
    }

    // Check streak badges
    const newStreak = userStats.currentStreak + 1;
    if (newStreak === 3 && !badges.includes('3-day-streak')) {
      await awardBadge('3-day-streak', 'Three days without impulse purchases');
    } else if (newStreak === 7 && !badges.includes('week-warrior')) {
      await awardBadge('week-warrior', 'A full week of mindful spending');
    }
  };

  const deleteWishlistItem = async (id: string) => {
    if (!user) return;

    await deleteDoc(doc(db, 'wishlist', id));
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  // Purchase functions
  const addPurchase = async (purchase: Omit<Purchase, 'id' | 'userId' | 'date'>) => {
    if (!user) return;

    const date = new Date();
    const newPurchase = {
      ...purchase,
      userId: user.uid,
      date
    };

    const docRef = await addDoc(collection(db, 'purchases'), {
      ...newPurchase,
      date: Timestamp.fromDate(date)
    });

    setPurchases(prev => [{ ...newPurchase, id: docRef.id }, ...prev]);

    // Update stats
    await updateUserStats({
      totalSpent: userStats.totalSpent + purchase.amount
    });
  };

  // User stats functions
  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!user) return;

    const newStats = { ...userStats, ...updates };
    
    // Calculate level based on points
    const pointsPerLevel = 300;
    const newLevel = Math.floor(newStats.totalPointsEarned / pointsPerLevel) + 1;
    if (newLevel > newStats.currentLevel) {
      newStats.currentLevel = newLevel;
      await awardPoints(100, `Reached Level ${newLevel}!`, 'level_up');
    }

    setUserStats(newStats);

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { stats: newStats });
  };

  // User settings functions
  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    const newSettings = { ...userSettings, ...updates };
    setUserSettings(newSettings);

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { settings: newSettings });
  };

  // ADHD Tax functions
  const addADHDTaxItem = async (item: Omit<ADHDTaxItem, 'id' | 'userId' | 'date'>) => {
    if (!user) return;

    const date = new Date();
    const newItem = {
      ...item,
      userId: user.uid,
      date
    };

    const docRef = await addDoc(collection(db, 'adhdTax'), {
      ...newItem,
      date: Timestamp.fromDate(date)
    });

    setADHDTaxItems(prev => [{ ...newItem, id: docRef.id }, ...prev]);

    // Update stats
    await updateUserStats({
      adhdTaxTotal: userStats.adhdTaxTotal + item.amount
    });
  };

  const deleteADHDTaxItem = async (id: string) => {
    if (!user) return;

    const item = adhdTaxItems.find(i => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, 'adhdTax', id));
    setADHDTaxItems(prev => prev.filter(item => item.id !== id));

    // Update stats
    await updateUserStats({
      adhdTaxTotal: userStats.adhdTaxTotal - item.amount
    });
  };

  // Rewards functions
  const awardPoints = async (points: number, description: string, source: string) => {
    if (!user) return;

    const earnedAt = new Date();
    const newReward: Omit<Reward, 'id'> = {
      userId: user.uid,
      type: 'points',
      points,
      earnedAt,
      description,
      source
    };

    const docRef = await addDoc(collection(db, 'rewards'), {
      ...newReward,
      earnedAt: Timestamp.fromDate(earnedAt)
    });

    setRewards(prev => [{ ...newReward, id: docRef.id }, ...prev]);

    // Update user stats
    await updateUserStats({
      totalPointsEarned: userStats.totalPointsEarned + points
    });
  };

  const awardBadge = async (badgeId: string, description: string) => {
    if (!user || badges.includes(badgeId)) return;

    const earnedAt = new Date();
    const newReward: Omit<Reward, 'id'> = {
      userId: user.uid,
      type: 'badge',
      badgeId,
      earnedAt,
      description,
      source: 'achievement'
    };

    const docRef = await addDoc(collection(db, 'rewards'), {
      ...newReward,
      earnedAt: Timestamp.fromDate(earnedAt)
    });

    setRewards(prev => [{ ...newReward, id: docRef.id }, ...prev]);

    // Update user badges
    const newBadges = [...badges, badgeId];
    setBadges(newBadges);

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { badges: newBadges });

    // Award bonus points for badge
    await awardPoints(100, `Earned badge: ${description}`, 'badge_earned');
  };

  const refreshData = async () => {
    await loadUserData();
  };

  const value = {
    wishlistItems,
    addToWishlist,
    updateWishlistItem,
    purchaseWishlistItem,
    dismissWishlistItem,
    deleteWishlistItem,
    purchases,
    addPurchase,
    userStats,
    updateUserStats,
    userSettings,
    updateUserSettings,
    adhdTaxItems,
    addADHDTaxItem,
    deleteADHDTaxItem,
    rewards,
    badges,
    awardPoints,
    awardBadge,
    loading,
    refreshData
  };

  return (
    <SpendGuardContext.Provider value={value}>
      {children}
    </SpendGuardContext.Provider>
  );
}

export function useSpendGuard() {
  const context = useContext(SpendGuardContext);
  if (context === undefined) {
    throw new Error('useSpendGuard must be used within a SpendGuardProvider');
  }
  return context;
}

