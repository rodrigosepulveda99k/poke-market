/**
 * UI Rendering Module - Handles all DOM manipulation and dynamic rendering
 */

import * as api from './api.js';

const TYPE_COLORS = {
    fire: '#FF6347',
    water: '#4169E1',
    grass: '#228B22',
    electric: '#FFD700',
    ice: '#87CEEB',
    fighting: '#8B4513',
    poison: '#800080',
    ground: '#D2B48C',
    flying: '#87CEEB',
    psychic: '#FF69B4',
    bug: '#90EE90',
    rock: '#A9A9A9',
    ghost: '#6A5ACD',
    dragon: '#FF6347',
    dark: '#2F4F4F',
    steel: '#A9A9A9',
    fairy: '#FFB6C1',
    normal: '#A8A878',
};

/**
 * Renders Pokémon cards in the grid
 * @param {Array} pokemonList - Array of Pokémon objects
 * @param {Array} prices - Array of price objects from Fake Store API
 */
export const renderPokemonGrid = (pokemonList, prices = []) => {
    const gridContainer = document.getElementById('pokemon-grid');
    gridContainer.innerHTML = '';

    pokemonList.forEach((pokemon) => {
        const price = api.getPriceForPokemon(pokemon.id, prices);
        const card = createPokemonCard(pokemon, price);
        gridContainer.appendChild(card);
    });
};

/**
 * Creates a single Pokémon card element
 * @param {Object} pokemon - Pokémon object with details
 * @param {number} price - Price of the Pokémon
 * @returns {HTMLElement} Card element
 */
function createPokemonCard(pokemon, price) {
    const card = document.createElement('div');
    card.className = 'pokemon-card fade-in';
    card.dataset.pokemonId = pokemon.id;

    const imageUrl =
        pokemon.sprites?.other?.['official-artwork']?.front_default ||
        pokemon.sprites?.front_default ||
        'https://via.placeholder.com/150';

    const types = pokemon.types.map((t) => t.type.name).slice(0, 2);

    card.innerHTML = `
        <div class="pokemon-card-image">
            <img src="${imageUrl}" alt="${pokemon.name}" loading="lazy">
        </div>
        <div class="pokemon-card-body">
            <h3 class="pokemon-card-name">${pokemon.name}</h3>
            <div class="pokemon-types">
                ${types
                    .map(
                        (type) =>
                            `<span class="type-badge ${type}">${type}</span>`
                    )
                    .join('')}
            </div>
            <div class="pokemon-price">$${price.toFixed(2)}</div>
            <button class="btn btn-primary view-details-btn" data-pokemon-id="${pokemon.id}">
                View Details
            </button>
        </div>
    `;

    return card;
}

/**
 * Renders type filter buttons
 * @param {Array} types - Array of type objects
 */
export const renderTypeFilters = (types) => {
    const container = document.getElementById('type-filter');
    container.innerHTML = '';

    types.forEach((type) => {
        const button = document.createElement('button');
        button.className = 'type-btn';
        button.dataset.type = type.name;
        button.textContent = type.name;
        button.setAttribute('aria-label', `Filter by ${type.name}`);
        container.appendChild(button);
    });
};

/**
 * Populates the detail modal with Pokémon information
 * @param {Object} pokemon - Pokémon object
 * @param {number} price - Price of the Pokémon
 */
export const renderPokemonModal = (pokemon, price) => {
    const imageUrl =
        pokemon.sprites?.other?.['official-artwork']?.front_default ||
        pokemon.sprites?.front_default ||
        'https://via.placeholder.com/300';

    const types = pokemon.types.map((t) => t.type.name);
    const stats = pokemon.stats;

    // Set image
    document.getElementById('modal-sprite').src = imageUrl;
    document.getElementById('modal-sprite').alt = pokemon.name;

    // Set name
    document.getElementById('modal-name').textContent = pokemon.name;

    // Set types
    const typesContainer = document.getElementById('modal-types');
    typesContainer.innerHTML = types
        .map(
            (type) =>
                `<span class="type-badge ${type}">${type}</span>`
        )
        .join('');

    // Set stats
    const statsContainer = document.getElementById('modal-stats');
    statsContainer.innerHTML = stats
        .map(
            (stat) => `
        <div class="stat-item">
            <div class="stat-label">${stat.stat.name}</div>
            <div class="stat-value">${stat.base_stat}</div>
        </div>
    `
        )
        .join('');

    // Set physical attributes
    document.getElementById('modal-height').textContent = `${(pokemon.height / 10).toFixed(1)} m`;
    document.getElementById('modal-weight').textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;

    const abilities = pokemon.abilities
        .map((a) => a.ability.name)
        .join(', ');
    document.getElementById('modal-abilities').textContent = abilities;

    // Set price and button
    document.getElementById('modal-price').textContent = `$${price.toFixed(2)}`;
    const addBtn = document.getElementById('modal-add-to-cart');
    addBtn.dataset.pokemonId = pokemon.id;
    addBtn.dataset.price = price;
};

/**
 * Renders cart items in the table
 * @param {Array} cartItems - Array of cart items from Cart class
 */
export const renderCartItems = (cartItems) => {
    const tbody = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('empty-cart-message');

    if (cartItems.length === 0) {
        tbody.innerHTML = '';
        emptyMessage.classList.remove('hide');
        return;
    }

    emptyMessage.classList.add('hide');
    tbody.innerHTML = cartItems
        .map(
            (item) => `
        <tr class="cart-item-new">
            <td data-label="Pokémon">
                <strong>${item.pokemon.name}</strong>
            </td>
            <td data-label="Price">
                $${item.pokemon.price.toFixed(2)}
            </td>
            <td data-label="Quantity">
                <div class="quantity-control">
                    <button class="quantity-btn quantity-decrease" data-pokemon-id="${item.pokemon.id}">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn quantity-increase" data-pokemon-id="${item.pokemon.id}">+</button>
                </div>
            </td>
            <td data-label="Total" class="item-total">
                $${(item.pokemon.price * item.quantity).toFixed(2)}
            </td>
            <td data-label="Action">
                <button class="remove-btn remove-item-btn" data-pokemon-id="${item.pokemon.id}">
                    Remove
                </button>
            </td>
        </tr>
    `
        )
        .join('');
};

/**
 * Updates the billing summary (subtotal, tax, total)
 * @param {Object} summary - Billing summary object from Cart.getBillingSummary()
 */
export const updateBillingSummary = (summary) => {
    document.getElementById('subtotal').textContent = `$${summary.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${summary.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${summary.total.toFixed(2)}`;
};

/**
 * Updates the cart item count in the header
 * @param {number} count - Number of items in cart
 */
export const updateCartCount = (count) => {
    const badge = document.querySelector('.cart-count');
    badge.textContent = count;
    if (badge.textContent === '0') {
        badge.textContent = '';
    }
};

/**
 * Shows the loading spinner
 */
export const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('active');
};

/**
 * Hides the loading spinner
 */
export const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('active');
};

/**
 * Shows a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 * @param {number} duration - Display duration in milliseconds
 */
export const showNotification = (message, type = 'success', duration = 3000) => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('active');

    // Set styling based on type
    notification.style.backgroundColor = getNotificationColor(type);

    setTimeout(() => {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.classList.remove('active', 'closing');
            notification.classList.add('hidden');
        }, 400);
    }, duration);
};

/**
 * Gets notification color based on type
 * @param {string} type - Notification type
 * @returns {string} CSS color
 */
function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#FF0000',
        info: '#3B4CCA',
        warning: '#FFD700',
    };
    return colors[type] || colors.info;
}

/**
 * Shows the modal with animation
 */
export const showModal = () => {
    const modal = document.getElementById('pokemon-modal');
    modal.classList.remove('hidden');
    modal.classList.add('active');
};

/**
 * Hides the modal with animation
 */
export const hideModal = () => {
    const modal = document.getElementById('pokemon-modal');
    modal.classList.add('hidden');
    modal.classList.remove('active');
};

/**
 * Switches between marketplace and cart sections
 * @param {string} section - Section name ('marketplace' or 'cart')
 */
export const switchSection = (section) => {
    // Hide all sections
    document.querySelectorAll('.section').forEach((sec) => {
        sec.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(section);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        if (link.href.includes(section)) {
            link.classList.add('active');
        }
    });
};

/**
 * Adds CSS class animation to an element
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class name
 */
export const addAnimation = (element, animationClass) => {
    element.classList.add(animationClass);
    element.addEventListener(
        'animationend',
        () => {
            element.classList.remove(animationClass);
        },
        { once: true }
    );
};

/**
 * Disables a button and shows loading state
 * @param {HTMLElement} button - Button element
 */
export const disableButton = (button) => {
    button.disabled = true;
    button.textContent = 'Loading...';
};

/**
 * Enables a button and restores original text
 * @param {HTMLElement} button - Button element
 * @param {string} originalText - Original button text
 */
export const enableButton = (button, originalText) => {
    button.disabled = false;
    button.textContent = originalText;
};

/**
 * Renders evolution chain in modal
 * @param {Array} evolutions - Array of evolution objects
 */
export const renderEvolutions = (evolutions) => {
    const evolutionsContainer = document.getElementById('modal-evolutions');
    if (!evolutionsContainer) return;

    if (!evolutions || evolutions.length === 0) {
        evolutionsContainer.classList.add('hide');
        return;
    }

    evolutionsContainer.classList.remove('hide');
    const evolutionsList = evolutionsContainer.querySelector('.evolutions-list');
    
    evolutionsList.innerHTML = evolutions
        .map(
            (evo, index) => `
        <div class="evolution-item">
            <span class="evolution-level">Lv. ${evo.level}</span>
            <span class="evolution-name">${evo.name}</span>
            <span class="evolution-trigger">(${evo.trigger})</span>
            ${index < evolutions.length - 1 ? '<span class="evolution-arrow">→</span>' : ''}
        </div>
    `
        )
        .join('');
};

/**
 * Renders Pokémon moves in modal
 * @param {Array} moves - Array of move objects
 */
export const renderMoves = (moves) => {
    const movesContainer = document.getElementById('modal-moves');
    if (!movesContainer) return;

    if (!moves || moves.length === 0) {
        movesContainer.classList.add('hide');
        return;
    }

    movesContainer.classList.remove('hide');
    const movesList = movesContainer.querySelector('.moves-list');
    
    movesList.innerHTML = moves
        .map(
            (move) => `
        <div class="move-item">
            <div class="move-header">
                <strong>${move.name}</strong>
                <span class="move-type">${move.type?.name || 'normal'}</span>
            </div>
            <div class="move-details">
                <span><strong>Power:</strong> ${move.power || '-'}</span>
                <span><strong>Accuracy:</strong> ${move.accuracy || '-'}%</span>
                <span><strong>PP:</strong> ${move.pp || '-'}</span>
            </div>
        </div>
    `
        )
        .join('');
};

/**
 * Renders collection of items (held items)
 * @param {Array} items - Array of item objects
 */
export const renderItems = (items) => {
    const itemsContainer = document.getElementById('modal-items');
    if (!itemsContainer) return;

    if (!items || items.length === 0) {
        itemsContainer.classList.add('hide');
        return;
    }

    itemsContainer.classList.remove('hide');
    const itemsList = itemsContainer.querySelector('.items-list');
    
    itemsList.innerHTML = items
        .map(
            (item) => `
        <div class="item-card">
            <img src="${item.sprites?.default || 'https://via.placeholder.com/50'}" 
                 alt="${item.name}" 
                 class="item-image"
                 onerror="this.src='https://via.placeholder.com/50'">
            <div class="item-info">
                <strong>${item.name}</strong>
                <p>${item.effect_entries?.[0]?.short_effect || 'No description'}</p>
            </div>
        </div>
    `
        )
        .join('');
};

/**
 * Shows loading state in modal for async operations
 * @param {string} section - Section name (evolutions, moves, items)
 */
export const showSectionLoading = (section) => {
    const container = document.getElementById(`modal-${section}`);
    if (container) {
        container.classList.remove('hide');
        container.innerHTML = '<div class="section-loading">Loading...</div>';
    }
};

/**
 * Hides a section in modal
 * @param {string} section - Section name
 */
export const hideSection = (section) => {
    const container = document.getElementById(`modal-${section}`);
    if (container) {
        container.classList.add('hide');
    }
};

export default {
    renderPokemonGrid,
    renderTypeFilters,
    renderPokemonModal,
    renderCartItems,
    updateBillingSummary,
    updateCartCount,
    showLoadingSpinner,
    hideLoadingSpinner,
    showNotification,
    showModal,
    hideModal,
    switchSection,
    addAnimation,
    disableButton,
    enableButton,
    renderEvolutions,
    renderMoves,
    renderItems,
    showSectionLoading,
    hideSection,
};
