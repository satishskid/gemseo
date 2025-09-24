import type { GeminiResults, StoredGrowthPlan, SeoFormData } from '../types';

const STORAGE_KEYS = {
  CURRENT_PLAN: 'gemseo_current_growth_plan',
  PLANS_HISTORY: 'gemseo_growth_plans_history',
  SESSION_BACKUP: 'gemseo_session_backup',
  FORM_DATA: 'seoFormData' // Existing key
};

const STORAGE_VERSION = '1.0';

/**
 * Save the current growth plan to localStorage with session backup
 */
export const saveGrowthPlan = (results: GeminiResults, formData: SeoFormData): string => {
  try {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const storedPlan: StoredGrowthPlan = {
      id: planId,
      results,
      formData,
      timestamp: Date.now(),
      businessName: formData.businessName || 'Unknown Business'
    };

    // Save as current plan
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(storedPlan));
    
    // Add to history (keep last 10 plans)
    addToHistory(storedPlan);
    
    // Create session backup
    sessionStorage.setItem(STORAGE_KEYS.SESSION_BACKUP, JSON.stringify(storedPlan));
    
    return planId;
  } catch (error) {
    console.error('Failed to save growth plan:', error);
    throw new Error('Unable to save growth plan. Storage may be full.');
  }
};

/**
 * Retrieve the current growth plan
 */
export const getCurrentGrowthPlan = (): StoredGrowthPlan | null => {
  try {
    // Try current plan first
    const currentPlan = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    if (currentPlan) {
      return JSON.parse(currentPlan);
    }
    
    // Fallback to session backup
    const sessionBackup = sessionStorage.getItem(STORAGE_KEYS.SESSION_BACKUP);
    if (sessionBackup) {
      return JSON.parse(sessionBackup);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to retrieve growth plan:', error);
    return null;
  }
};

/**
 * Get all stored growth plans history
 */
export const getGrowthPlansHistory = (): StoredGrowthPlan[] => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.PLANS_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to retrieve growth plans history:', error);
    return [];
  }
};

/**
 * Add plan to history (maintains last 10 plans)
 */
const addToHistory = (plan: StoredGrowthPlan): void => {
  try {
    const history = getGrowthPlansHistory();
    const updatedHistory = [plan, ...history].slice(0, 10); // Keep only last 10
    localStorage.setItem(STORAGE_KEYS.PLANS_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to update history:', error);
  }
};

/**
 * Clear current plan (but keep history)
 */
export const clearCurrentGrowthPlan = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_BACKUP);
  } catch (error) {
    console.error('Failed to clear current plan:', error);
  }
};

/**
 * Clear all stored data (including history)
 */
export const clearAllGrowthPlans = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    localStorage.removeItem(STORAGE_KEYS.PLANS_HISTORY);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_BACKUP);
  } catch (error) {
    console.error('Failed to clear all plans:', error);
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): { used: number; remaining: number; total: number } => {
  try {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    
    // Approximate total storage (varies by browser)
    const totalStorage = 5 * 1024 * 1024; // 5MB typical limit
    const remaining = Math.max(0, totalStorage - totalSize);
    
    return {
      used: totalSize,
      remaining,
      total: totalStorage
    };
  } catch (error) {
    return { used: 0, remaining: 0, total: 0 };
  }
};