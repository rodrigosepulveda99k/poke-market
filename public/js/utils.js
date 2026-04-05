/**
 * Utility Functions for Poké-Market
 * Client-side helper functions
 */

// Notification System
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                         type === 'error' ? '#FF0000' : 
                                         type === 'warning' ? '#FF9800' : '#2196F3';
    notification.classList.remove('hidden');
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('active');
    }, duration);
}

// Format currency
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(price);
}

// Format number with decimals
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// Capitalize string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// API Call Helper
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    
    try {
        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Local Storage Helpers
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    }
};

// DOM Helpers
const DOM = {
    // Get element
    get: (selector) => document.querySelector(selector),
    
    // Get all elements
    getAll: (selector) => document.querySelectorAll(selector),
    
    // Create element
    create: (tag, options = {}) => {
        const element = document.createElement(tag);
        if (options.class) element.className = options.class;
        if (options.id) element.id = options.id;
        if (options.text) element.textContent = options.text;
        if (options.html) element.innerHTML = options.html;
        Object.keys(options).forEach(key => {
            if (key.startsWith('data-')) {
                element.setAttribute(key, options[key]);
            }
        });
        return element;
    },
    
    // Add class
    addClass: (element, className) => {
        element?.classList.add(className);
    },
    
    // Remove class
    removeClass: (element, className) => {
        element?.classList.remove(className);
    },
    
    // Toggle class
    toggleClass: (element, className) => {
        element?.classList.toggle(className);
    },
    
    // Has class
    hasClass: (element, className) => {
        return element?.classList.contains(className) || false;
    },
    
    // Show element
    show: (element) => {
        if (element) element.style.display = '';
    },
    
    // Hide element
    hide: (element) => {
        if (element) element.style.display = 'none';
    },
    
    // Toggle visibility
    toggle: (element) => {
        if (element) {
            element.style.display = element.style.display === 'none' ? '' : 'none';
        }
    },
    
    // Remove element
    remove: (element) => {
        element?.remove();
    },
    
    // Empty element
    empty: (element) => {
        if (element) element.innerHTML = '';
    },
};

// Array helpers
const ArrayUtils = {
    // Unique values
    unique: (arr) => [...new Set(arr)],
    
    // Group by key
    groupBy: (arr, key) => {
        return arr.reduce((acc, obj) => {
            const group = obj[key];
            if (!acc[group]) acc[group] = [];
            acc[group].push(obj);
            return acc;
        }, {});
    },
    
    // Sort by key
    sortBy: (arr, key, order = 'asc') => {
        return [...arr].sort((a, b) => {
            if (order === 'asc') return a[key] > b[key] ? 1 : -1;
            return a[key] < b[key] ? 1 : -1;
        });
    },
    
    // Filter by key value
    filterBy: (arr, key, value) => {
        return arr.filter(obj => obj[key] === value);
    }
};

// Validation helpers
const Validation = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isNumber: (num) => !isNaN(parseFloat(num)) && isFinite(num),
    isPositive: (num) => Validation.isNumber(num) && parseFloat(num) > 0,
    isEmpty: (str) => !str || str.trim() === '',
    isUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Log function (for development)
function log(...args) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Poké-Market]', ...args);
    }
}

// Export for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        formatPrice,
        formatNumber,
        capitalize,
        debounce,
        throttle,
        apiCall,
        storage,
        DOM,
        ArrayUtils,
        Validation,
        log
    };
}
