/**
 * Storage Module - Handles localStorage operations for persistent data
 */

const STORAGE_KEYS = {
    CART: 'poke-market-cart',
    USER_PREFERENCES: 'poke-market-preferences',
    LAST_VIEWED: 'poke-market-last-viewed',
    CACHE_PREFIX: 'poke-market-cache-',
    CACHE_TIMESTAMP_PREFIX: 'poke-market-cache-ts-',
};

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Gets the current shopping cart from localStorage
 * @returns {Array} Array of cart items
 */
export const getCart = () => {
    try {
        const cart = localStorage.getItem(STORAGE_KEYS.CART);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error retrieving cart from storage:', error);
        return [];
    }
};

/**
 * Saves the shopping cart to localStorage
 * @param {Array} cartItems - Array of items to save
 */
export const saveCart = (cartItems) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
};

/**
 * Clears the entire shopping cart from localStorage
 */
export const clearCart = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.CART);
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
};

/**
 * Saves user preferences
 * @param {Object} preferences - User preference object
 */
export const savePreferences = (preferences) => {
    try {
        localStorage.setItem(
            STORAGE_KEYS.USER_PREFERENCES,
            JSON.stringify(preferences)
        );
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
};

/**
 * Gets user preferences from localStorage
 * @returns {Object} User preferences object
 */
export const getPreferences = () => {
    try {
        const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return prefs
            ? JSON.parse(prefs)
            : {
                  theme: 'light',
                  currency: 'USD',
              };
    } catch (error) {
        console.error('Error retrieving preferences:', error);
        return { theme: 'light', currency: 'USD' };
    }
};

/**
 * Saves the last viewed Pokémon
 * @param {number} pokemonId - ID of the Pokémon
 */
export const saveLastViewedPokemon = (pokemonId) => {
    try {
        localStorage.setItem(
            STORAGE_KEYS.LAST_VIEWED,
            JSON.stringify({ pokemonId, timestamp: Date.now() })
        );
    } catch (error) {
        console.error('Error saving last viewed Pokémon:', error);
    }
};

/**
 * Gets the last viewed Pokémon
 * @returns {Object} Last viewed Pokémon object
 */
export const getLastViewedPokemon = () => {
    try {
        const lastViewed = localStorage.getItem(STORAGE_KEYS.LAST_VIEWED);
        return lastViewed ? JSON.parse(lastViewed) : null;
    } catch (error) {
        console.error('Error retrieving last viewed Pokémon:', error);
        return null;
    }
};

/**
 * Saves data to cache with timestamp
 * @param {string} key - Cache key (e.g., 'pokemon-25' or 'evolution-chain-1')
 * @param {any} data - Data to cache
 */
export const setCache = (key, data) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
        const timestampKey = `${STORAGE_KEYS.CACHE_TIMESTAMP_PREFIX}${key}`;
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(timestampKey, Date.now().toString());
    } catch (error) {
        console.error('Error setting cache:', error);
    }
};

/**
 * Retrieves data from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCache = (key) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
        const timestampKey = `${STORAGE_KEYS.CACHE_TIMESTAMP_PREFIX}${key}`;
        
        const timestamp = localStorage.getItem(timestampKey);
        if (!timestamp) return null;
        
        // Check if cache has expired
        if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(timestampKey);
            return null;
        }
        
        const data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null;
    }
};

/**
 * Clears a specific cache entry
 * @param {string} key - Cache key to clear
 */
export const clearCacheEntry = (key) => {
    try {
        const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
        const timestampKey = `${STORAGE_KEYS.CACHE_TIMESTAMP_PREFIX}${key}`;
        
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
    } catch (error) {
        console.error('Error clearing cache entry:', error);
    }
};

/**
 * Clears all cache entries
 */
export const clearAllCache = () => {
    try {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(STORAGE_KEYS.CACHE_PREFIX) || 
                key.startsWith(STORAGE_KEYS.CACHE_TIMESTAMP_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};

/**
 * Gets cache statistics
 * @returns {Object} Cache size and entry count
 */
export const getCacheStats = () => {
    try {
        let size = 0;
        let entries = 0;
        
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
                entries++;
                const item = localStorage.getItem(key);
                size += item ? item.length : 0;
            }
        });
        
        return {
            entries,
            sizeKB: (size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error('Error getting cache stats:', error);
        return { entries: 0, sizeKB: '0' };
    }
};

/**
 * Checks if localStorage is available in the browser
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
    try {
        const test = '__poke_market_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.warn('localStorage is not available:', error);
        return false;
    }
};

/**
 * Exports all cart data (useful for backup/export)
 * @returns {string} JSON string of cart data
 */
export const exportCartData = () => {
    try {
        return JSON.stringify(getCart(), null, 2);
    } catch (error) {
        console.error('Error exporting cart data:', error);
        return '';
    }
};

/**
 * Imports cart data from JSON
 * @param {string} jsonData - JSON string of cart data
 */
export const importCartData = (jsonData) => {
    try {
        const cartItems = JSON.parse(jsonData);
        if (Array.isArray(cartItems)) {
            saveCart(cartItems);
            return true;
        }
        throw new Error('Invalid cart data format');
    } catch (error) {
        console.error('Error importing cart data:', error);
        return false;
    }
};

export default {
    getCart,
    saveCart,
    clearCart,
    savePreferences,
    getPreferences,
    saveLastViewedPokemon,
    getLastViewedPokemon,
    setCache,
    getCache,
    clearCacheEntry,
    clearAllCache,
    getCacheStats,
    isStorageAvailable,
    exportCartData,
    importCartData,
};
