/**
 * Cart Logic Module - Manages shopping cart state and operations
 */

import * as storage from './storage.js';

class Cart {
    constructor() {
        this.items = storage.getCart();
        this.TAX_RATE = 0.21; // 21% VAT
    }

    /**
     * Adds a Pokémon to the cart or increases quantity if already exists
     * @param {Object} pokemon - Pokémon object to add
     * @param {number} pokemon.id - Pokémon ID
     * @param {string} pokemon.name - Pokémon name
     * @param {number} pokemon.price - Price of the Pokémon
     * @param {string} pokemon.image - URL of Pokémon sprite
     * @param {number} quantity - How many to add (default: 1)
     * @returns {Object} The added/updated item
     */
    addItem(pokemon, quantity = 1) {
        const existingItem = this.items.find(
            (item) => item.pokemon.id === pokemon.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                pokemon,
                quantity,
                addedAt: new Date().toISOString(),
            });
        }

        this.saveToStorage();
        return existingItem || this.items[this.items.length - 1];
    }

    /**
     * Removes an item from the cart
     * @param {number} pokemonId - ID of the Pokémon to remove
     * @returns {boolean} True if item was removed
     */
    removeItem(pokemonId) {
        const index = this.items.findIndex(
            (item) => item.pokemon.id === pokemonId
        );
        if (index > -1) {
            this.items.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Updates the quantity of an item in the cart
     * @param {number} pokemonId - ID of the Pokémon
     * @param {number} quantity - New quantity
     * @returns {boolean} True if updated successfully
     */
    updateQuantity(pokemonId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(pokemonId);
        }

        const item = this.items.find(
            (item) => item.pokemon.id === pokemonId
        );
        if (item) {
            item.quantity = quantity;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Gets an item from the cart
     * @param {number} pokemonId - ID of the Pokémon
     * @returns {Object|null} The cart item or null
     */
    getItem(pokemonId) {
        return (
            this.items.find((item) => item.pokemon.id === pokemonId) || null
        );
    }

    /**
     * Clears all items from the cart
     */
    clear() {
        this.items = [];
        this.saveToStorage();
    }

    /**
     * Gets all items in the cart
     * @returns {Array} Array of cart items
     */
    getItems() {
        return this.items;
    }

    /**
     * Gets the total number of items in the cart
     * @returns {number} Total quantity
     */
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Calculates the subtotal (before tax)
     * @returns {number} Subtotal in USD
     */
    getSubtotal() {
        return this.items.reduce(
            (sum, item) => sum + item.pokemon.price * item.quantity,
            0
        );
    }

    /**
     * Calculates the tax (VAT)
     * @returns {number} Tax amount in USD
     */
    getTax() {
        return this.getSubtotal() * this.TAX_RATE;
    }

    /**
     * Calculates the total (subtotal + tax)
     * @returns {number} Total in USD
     */
    getTotal() {
        return this.getSubtotal() + this.getTax();
    }

    /**
     * Gets complete billing summary
     * @returns {Object} Billing object
     */
    getBillingSummary() {
        const subtotal = this.getSubtotal();
        const tax = this.getTax();
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat((subtotal + tax).toFixed(2)),
            itemCount: this.getItemCount(),
        };
    }

    /**
     * Checks if a Pokémon is in the cart
     * @param {number} pokemonId - ID of the Pokémon
     * @returns {boolean} True if Pokémon is in cart
     */
    hasItem(pokemonId) {
        return this.items.some((item) => item.pokemon.id === pokemonId);
    }

    /**
     * Saves the cart to localStorage
     */
    saveToStorage() {
        storage.saveCart(this.items);
    }

    /**
     * Returns a formatted string for total price
     * @returns {string} Formatted total price
     */
    getFormattedTotal() {
        return `$${this.getTotal().toFixed(2)}`;
    }

    /**
     * Applies a discount percentage (optional feature)
     * @param {number} discountPercent - Discount percentage (0-100)
     * @returns {number} New total after discount
     */
    applyDiscount(discountPercent) {
        const discount = (discountPercent / 100) * this.getSubtotal();
        const discountedSubtotal = this.getSubtotal() - discount;
        const tax = discountedSubtotal * this.TAX_RATE;
        return parseFloat((discountedSubtotal + tax).toFixed(2));
    }

    /**
     * Validates if the cart has items
     * @returns {boolean} True if cart has items
     */
    isNotEmpty() {
        return this.items.length > 0;
    }

    /**
     * Gets checkout-ready data
     * @returns {Object} Order object ready for checkout
     */
    getCheckoutData() {
        return {
            items: this.items.map((item) => ({
                pokemonId: item.pokemon.id,
                name: item.pokemon.name,
                price: item.pokemon.price,
                quantity: item.quantity,
                total: item.pokemon.price * item.quantity,
            })),
            ...this.getBillingSummary(),
            timestamp: new Date().toISOString(),
        };
    }
}

export default Cart;
