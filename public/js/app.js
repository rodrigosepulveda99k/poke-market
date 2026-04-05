/**
 * Poké-Market Main Application
 * Client-side application logic
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initializeApp();
});

function initializeApp() {
    // Check current page
    const isMarketplacePage = document.getElementById('type-filter') !== null;
    const isCartPage = document.getElementById('cart-items-body') !== null;
    
    if (isMarketplacePage) {
        initializeMarketplace();
    } else if (isCartPage) {
        initializeCart();
    }
    
    // Initialize cart badge update
    updateCartBadge();
}

/**
 * Marketplace Page Initialization
 */
function initializeMarketplace() {
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const clearFilterBtn = document.getElementById('clear-filters');
    const modal = document.getElementById('pokemon-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    
    let selectedType = null;
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.pokemon-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const name = card.querySelector('.pokemon-card-name')?.textContent?.toLowerCase() || '';
                const isVisible = name.includes(term);
                card.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            });
            
            if (visibleCount === 0) {
                showNotification('No Pokémon found', 'warning');
            }
        }, 300));
    }
    
    // Type filtering
    if (typeFilter) {
        typeFilter.addEventListener('click', function(e) {
            if (e.target.classList.contains('type-btn')) {
                const typeName = e.target.dataset.type;
                
                if (e.target.classList.contains('active')) {
                    e.target.classList.remove('active');
                    selectedType = null;
                } else {
                    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    selectedType = typeName;
                }
                filterCardsByType(selectedType);
            }
        });
    }
    
    // Clear filters
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            selectedType = null;
            searchInput.value = '';
            document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.pokemon-card').forEach(card => card.style.display = 'block');
            showNotification('Filters cleared', 'success');
        });
    }
    
    // View details button
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const pokemonId = this.dataset.pokemonId;
            await openPokemonModal(pokemonId, modal);
        });
    });
    
    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
    
    // Add to cart from modal
    document.getElementById('modal-add-to-cart')?.addEventListener('click', async function() {
        const pokemonId = this.dataset.pokemonId;
        const price = parseFloat(this.dataset.price);
        
        // Get pokemon name from modal
        const name = document.getElementById('modal-name')?.textContent || 'Unknown';
        
        try {
            const response = await apiCall('/api/cart/add', {
                method: 'POST',
                body: JSON.stringify({
                    pokemon: { id: pokemonId, name, price }
                })
            });
            
            if (response.success) {
                showNotification(response.message, 'success');
                updateCartBadge(response.cartCount);
                closeModal(modal);
            }
        } catch (error) {
            showNotification('Failed to add to cart', 'error');
        }
    });
}

/**
 * Cart Page Initialization
 */
function initializeCart() {
    // Quantity controls
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const pokemonId = this.dataset.pokemonId;
            const input = document.querySelector(`input[data-pokemon-id="${pokemonId}"]`);
            if (input) {
                const newQty = Math.max(1, parseInt(input.value) - 1);
                updateCartItemQuantity(pokemonId, newQty);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const pokemonId = this.dataset.pokemonId;
            const input = document.querySelector(`input[data-pokemon-id="${pokemonId}"]`);
            if (input) {
                const newQty = Math.min(99, parseInt(input.value) + 1);
                updateCartItemQuantity(pokemonId, newQty);
            }
        });
    });
    
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            const qty = parseInt(this.value) || 1;
            const limited = Math.min(99, Math.max(1, qty));
            this.value = limited;
            updateCartItemQuantity(this.dataset.pokemonId, limited);
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const pokemonId = this.dataset.pokemonId;
            if (confirm('Are you sure you want to remove this item?')) {
                await removeCartItem(pokemonId);
            }
        });
    });
    
    // Checkout
    document.getElementById('checkout-btn')?.addEventListener('click', async function() {
        try {
            const response = await apiCall('/api/cart/checkout', {
                method: 'POST'
            });
            
            if (response.success) {
                showNotification('✓ Checkout successful!', 'success', 2000);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        } catch (error) {
            showNotification('Checkout failed', 'error');
        }
    });
}

/**
 * Filter Pokémon cards by type
 */
function filterCardsByType(type) {
    const cards = document.querySelectorAll('.pokemon-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const types = card.querySelectorAll('.type-badge');
        let hasType = false;
        
        types.forEach(typeElem => {
            if (typeElem.textContent.toLowerCase() === type?.toLowerCase()) {
                hasType = true;
            }
        });
        
        const isVisible = !type || hasType;
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    if (visibleCount === 0) {
        showNotification('No Pokémon of this type found', 'warning');
    }
}

/**
 * Open Pokémon detail modal
 */
async function openPokemonModal(pokemonId, modal) {
    try {
        const response = await apiCall(`/api/pokemon/${pokemonId}`);
        const data = response.data || response;
        
        renderPokemonModal(data);
        
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
        }
    } catch (error) {
        showNotification('Failed to load Pokémon details', 'error');
    }
}

/**
 * Render Pokémon modal content
 */
function renderPokemonModal(data) {
    const { pokemon, price, evolutions = [], moves = [] } = data;
    
    // Basic info
    const sprite = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default || 
                   'https://via.placeholder.com/200';
    
    const addBtn = document.getElementById('modal-add-to-cart');
    if (addBtn) {
        addBtn.dataset.pokemonId = pokemon.id;
        addBtn.dataset.price = price;
    }
    
    document.getElementById('modal-sprite').src = sprite;
    document.getElementById('modal-name').textContent = capitalize(pokemon.name);
    document.getElementById('modal-price').textContent = formatPrice(price);
    
    // Types
    const typesHtml = pokemon.types
        .map(t => `<span class="type-badge ${t.type.name}">${capitalize(t.type.name)}</span>`)
        .join('');
    document.getElementById('modal-types').innerHTML = typesHtml;
    
    // Stats
    const statsHtml = pokemon.stats
        .map(s => `
            <div class="stat-item">
                <div class="stat-label">${capitalize(s.stat.name)}</div>
                <div class="stat-value">${s.base_stat}</div>
            </div>
        `)
        .join('');
    document.getElementById('modal-stats').innerHTML = statsHtml;
    
    // Details
    document.getElementById('modal-height').textContent = `${(pokemon.height / 10).toFixed(1)} m`;
    document.getElementById('modal-weight').textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
    document.getElementById('modal-abilities').textContent = 
        pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ');
    
    // Evolutions
    if (evolutions && evolutions.length > 0) {
        const evolutionsSection = document.getElementById('modal-evolutions');
        if (evolutionsSection) {
            evolutionsSection.classList.remove('hide');
            document.querySelector('.evolutions-list').innerHTML = evolutions
                .map((e, i) => `
                    <div class="evolution-item">
                        <span class="evolution-level">${e.level || 'Lv. ?'}</span>
                        <span class="evolution-name">${capitalize(e.name)}</span>
                        ${e.trigger ? `<span class="evolution-trigger">(${e.trigger})</span>` : ''}
                        ${i < evolutions.length - 1 ? '<span class="evolution-arrow">→</span>' : ''}
                    </div>
                `)
                .join('');
        }
    }
    
    // Moves
    if (moves && moves.length > 0) {
        const movesSection = document.getElementById('modal-moves');
        if (movesSection) {
            movesSection.classList.remove('hide');
            document.querySelector('.moves-list').innerHTML = moves
                .slice(0, 10)
                .map(m => `
                    <div class="move-item">
                        <div class="move-header">
                            <strong>${capitalize(m.name)}</strong>
                            <span class="move-type">${capitalize(m.type?.name || 'normal')}</span>
                        </div>
                        <div class="move-details">
                            <span><strong>Power:</strong> ${m.power || '-'}</span>
                            <span><strong>Acc:</strong> ${m.accuracy || '-'}%</span>
                            <span><strong>PP:</strong> ${m.pp || '-'}</span>
                        </div>
                    </div>
                `)
                .join('');
        }
    }
}

/**
 * Close modal
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('active');
    }
}

/**
 * Update cart item quantity
 */
async function updateCartItemQuantity(pokemonId, quantity) {
    try {
        const response = await apiCall('/api/cart/update-quantity', {
            method: 'POST',
            body: JSON.stringify({ pokemonId, quantity })
        });
        
        if (response.success) {
            updateSummary(response.summary);
            updateSubtotal(pokemonId, quantity);
        }
    } catch (error) {
        showNotification('Failed to update quantity', 'error');
    }
}

/**
 * Remove item from cart
 */
async function removeCartItem(pokemonId) {
    try {
        const response = await apiCall('/api/cart/remove', {
            method: 'POST',
            body: JSON.stringify({ pokemonId })
        });
        
        if (response.success) {
            location.reload();
        }
    } catch (error) {
        showNotification('Failed to remove item', 'error');
    }
}

/**
 * Update cart summary display
 */
function updateSummary(summary) {
    document.getElementById('subtotal').textContent = formatNumber(summary.subtotal);
    document.getElementById('tax').textContent = formatNumber(summary.tax);
    document.getElementById('total').textContent = formatNumber(summary.total);
    document.getElementById('total-items').textContent = summary.itemCount;
}

/**
 * Update subtotal for a cart row
 */
function updateSubtotal(pokemonId, quantity) {
    const row = document.querySelector(`[data-pokemon-id="${pokemonId}"]`);
    if (row) {
        const price = parseFloat(row.querySelector('.price')?.textContent?.replace('$', '') || 0);
        const subtotal = formatNumber(price * quantity);
        const subtotalElem = row.querySelector('.subtotal-value');
        if (subtotalElem) {
            subtotalElem.textContent = subtotal;
        }
    }
}

/**
 * Update cart badge with item count
 */
function updateCartBadge(count) {
    const badge = document.querySelector('.cart-count');
    if (badge) {
        if (count !== undefined) {
            badge.textContent = count;
        } else {
            // Fetch current count from server
            apiCall('/api/cart/summary')
                .then(response => {
                    if (response.summary) {
                        badge.textContent = response.summary.itemCount || 0;
                    }
                })
                .catch(() => {
                    badge.textContent = '0';
                });
        }
    }
}

// Expose globally for debugging
window.PokeMarket = {
    showNotification,
    formatPrice,
    capitalize,
    apiCall,
    updateCartBadge
};
