/**
 * Main Application Entry Point
 * Initializes the Poké-Market application
 */

import * as api from './api.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import Cart from './cart.js';

// ============== Global State ==============
let cart = new Cart();
let allPokemon = [];
let allTypes = [];
let storePrices = [];
let selectedType = null;
let searchQuery = '';

// ============== Initialization ==============
const init = async () => {
    try {
        ui.showLoadingSpinner();

        // Fetch initial data
        console.log('Fetching Pokémon data...');
        allPokemon = await api.fetchPokemonList(50);

        // Fetch Pokémon details for each
        console.log('Fetching detailed Pokémon info...');
        const detailedPokemon = await api.fetchMultiplePokemon(
            allPokemon.map((p) => p.name)
        );
        allPokemon = detailedPokemon;

        // Fetch types
        console.log('Fetching type filters...');
        allTypes = await api.fetchPokemonTypes();

        // Fetch prices
        console.log('Fetching pricing data...');
        storePrices = await api.fetchStorePrices(20);

        // Initial render
        ui.renderPokemonGrid(allPokemon, storePrices);
        ui.renderTypeFilters(allTypes);
        updateCartUI();

        // Attach event listeners
        attachEventListeners();

        console.log('✅ Poké-Market initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
        ui.showNotification(
            'Failed to load Pokémon. Please refresh the page.',
            'error',
            5000
        );
    } finally {
        ui.hideLoadingSpinner();
    }
};

// ============== Event Listeners ==============
const attachEventListeners = () => {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);

    // Type filter buttons
    const typeFilter = document.getElementById('type-filter');
    typeFilter.addEventListener('click', handleTypeFilter);

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    clearFiltersBtn.addEventListener('click', handleClearFilters);

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', handleNavigation);
    });

    // Cart button
    const cartBtn = document.getElementById('cart-icon');
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ui.switchSection('cart');
    });

    // Pokémon grid delegation (view details)
    const grid = document.getElementById('pokemon-grid');
    grid.addEventListener('click', handleViewDetails);

    // Modal events
    const modal = document.getElementById('pokemon-modal');
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', ui.hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) ui.hideModal();
    });

    // Add to cart from modal
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.addEventListener('click', handleAddToCartFromModal);

    // Cart item actions
    const tbody = document.getElementById('cart-items');
    tbody.addEventListener('click', handleCartItemAction);

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', handleCheckout);

    // Continue shopping button
    const continuBtn = document.getElementById('continue-shopping-btn');
    continuBtn.addEventListener('click', () => ui.switchSection('marketplace'));
};

// ============== Event Handlers ==============

/**
 * Handles search input
 */
const handleSearch = (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterAndRenderPokemon();
};

/**
 * Handles type filter button clicks
 */
const handleTypeFilter = (e) => {
    if (e.target.classList.contains('type-btn')) {
        // Toggle type filter
        if (e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            selectedType = null;
        } else {
            // Remove active from all buttons
            document
                .querySelectorAll('.type-btn')
                .forEach((btn) => btn.classList.remove('active'));
            e.target.classList.add('active');
            selectedType = e.target.dataset.type;
        }

        filterAndRenderPokemon();
    }
};

/**
 * Clears all active filters
 */
const handleClearFilters = () => {
    selectedType = null;
    searchQuery = '';
    document.getElementById('search-input').value = '';
    document
        .querySelectorAll('.type-btn')
        .forEach((btn) => btn.classList.remove('active'));
    ui.renderPokemonGrid(allPokemon, storePrices);
};

/**
 * Filters and re-renders Pokémon based on current filters
 */
const filterAndRenderPokemon = () => {
    let filtered = allPokemon;

    // Apply type filter
    if (selectedType) {
        filtered = filtered.filter((pokemon) =>
            pokemon.types.some((t) => t.type.name === selectedType)
        );
    }

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchQuery)
        );
    }

    ui.renderPokemonGrid(filtered, storePrices);
};

/**
 * Handles navigation link clicks
 */
const handleNavigation = (e) => {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const section = href.replace('#', '');
    ui.switchSection(section);
};

/**
 * Handles "View Details" button clicks
 */
const handleViewDetails = async (e) => {
    const button = e.target.closest('.view-details-btn');
    if (button) {
        const pokemonId = button.dataset.pokemonId;
        const pokemon = allPokemon.find((p) => p.id === parseInt(pokemonId));

        if (pokemon) {
            const price = api.getPriceForPokemon(pokemon.id, storePrices);
            ui.renderPokemonModal(pokemon, price);
            ui.showModal();
            storage.saveLastViewedPokemon(pokemon.id);

            // Load additional data asynchronously
            loadPokemonAdditionalData(pokemon);
        }
    }
};

/**
 * Loads evolution chain, moves, and items for a Pokémon
 */
const loadPokemonAdditionalData = async (pokemon) => {
    try {
        // Show loading states
        ui.showSectionLoading('evolutions');
        ui.showSectionLoading('moves');
        ui.showSectionLoading('items');

        // Fetch species data for evolution chain
        const speciesKey = `species-${pokemon.id}`;
        let speciesData = storage.getCache(speciesKey);
        
        if (!speciesData) {
            speciesData = await api.fetchPokemonSpecies(pokemon.id);
            if (speciesData) {
                storage.setCache(speciesKey, speciesData);
            }
        }

        // Fetch and render evolution chain
        if (speciesData?.evolution_chain?.url) {
            const chainId = speciesData.evolution_chain.url.split('/').filter(Boolean).pop();
            const evolutionKey = `evolution-chain-${chainId}`;
            let chainData = storage.getCache(evolutionKey);
            
            if (!chainData) {
                chainData = await api.fetchEvolutionChain(chainId);
                if (chainData) {
                    storage.setCache(evolutionKey, chainData);
                }
            }

            if (chainData) {
                const evolutions = api.parseEvolutionChain(chainData);
                ui.renderEvolutions(evolutions);
            } else {
                ui.hideSection('evolutions');
            }
        } else {
            ui.hideSection('evolutions');
        }

        // Fetch and render moves
        if (pokemon.moves && pokemon.moves.length > 0) {
            const movesKey = `moves-${pokemon.id}`;
            let movesData = storage.getCache(movesKey);
            
            if (!movesData) {
                movesData = await api.getPokemonMoves(pokemon.moves);
                if (movesData.length > 0) {
                    storage.setCache(movesKey, movesData);
                }
            }

            if (movesData && movesData.length > 0) {
                ui.renderMoves(movesData);
            } else {
                ui.hideSection('moves');
            }
        } else {
            ui.hideSection('moves');
        }

        // Fetch and render items (limited implementation)
        ui.hideSection('items'); // Placeholder for future implementation

    } catch (error) {
        console.error('Error loading additional Pokémon data:', error);
        ui.hideSection('evolutions');
        ui.hideSection('moves');
        ui.hideSection('items');
    }
};

/**
 * Handles adding Pokémon to cart from modal
 */
const handleAddToCartFromModal = (e) => {
    const button = e.target;
    const pokemonId = parseInt(button.dataset.pokemonId);
    const price = parseFloat(button.dataset.price);

    const pokemon = allPokemon.find((p) => p.id === pokemonId);
    if (pokemon) {
        cart.addItem({ ...pokemon, price }, 1);
        ui.showNotification(
            `${pokemon.name} added to cart!`,
            'success',
            2000
        );
        updateCartUI();
        ui.hideModal();

        // Trigger pokéball bounce animation
        const cartBtn = document.getElementById('cart-icon').querySelector('.cart-btn');
        ui.addAnimation(cartBtn, 'pokeball-bounce');
    }
};

/**
 * Handles cart item quantity and removal
 */
const handleCartItemAction = (e) => {
    const pokemonId = parseInt(e.target.dataset.pokemonId);

    if (e.target.classList.contains('quantity-increase')) {
        cart.updateQuantity(pokemonId, cart.getItem(pokemonId).quantity + 1);
    } else if (e.target.classList.contains('quantity-decrease')) {
        const item = cart.getItem(pokemonId);
        if (item.quantity > 1) {
            cart.updateQuantity(pokemonId, item.quantity - 1);
        }
    } else if (e.target.classList.contains('remove-item-btn')) {
        const item = cart.getItem(pokemonId);
        cart.removeItem(pokemonId);
        ui.showNotification(
            `${item.pokemon.name} removed from cart`,
            'info',
            2000
        );
    }

    updateCartUI();
};

/**
 * Updates cart display
 */
const updateCartUI = () => {
    const cartItems = cart.getItems();
    ui.renderCartItems(cartItems);
    ui.updateBillingSummary(cart.getBillingSummary());
    ui.updateCartCount(cart.getItemCount());
};

/**
 * Handles checkout process
 */
const handleCheckout = () => {
    if (!cart.isNotEmpty()) {
        ui.showNotification(
            'Your cart is empty!',
            'warning',
            2000
        );
        return;
    }

    const checkoutData = cart.getCheckoutData();
    console.log('Checkout Data:', checkoutData);

    // Simulate checkout process
    ui.showNotification(
        `Order placed! Total: ${cart.getFormattedTotal()}`,
        'success',
        3000
    );

    // Clear cart after checkout
    setTimeout(() => {
        cart.clear();
        updateCartUI();
        ui.switchSection('marketplace');
        ui.showNotification(
            'Cart cleared. Happy shopping!',
            'info',
            2000
        );
    }, 3500);
};

// ============== Application Start ==============
document.addEventListener('DOMContentLoaded', init);

// Export for debugging
window.debugPoke = {
    cart,
    allPokemon,
    api,
    storage,
    ui,
    cache: {
        stats: () => storage.getCacheStats(),
        clear: () => storage.clearAllCache(),
        list: () => {
            const items = [];
            for (let key in localStorage) {
                if (key.startsWith('poke-market-cache-')) {
                    items.push(key.replace('poke-market-cache-', ''));
                }
            }
            return items;
        },
    },
};
