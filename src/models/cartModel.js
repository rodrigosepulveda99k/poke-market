/**
 * Cart Model - Shopping cart logic
 */

class CartModel {
    constructor() {
        this.items = [];
        this.TAX_RATE = 0.21; // 21% VAT
    }

    /**
     * Add item to cart
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

        return existingItem || this.items[this.items.length - 1];
    }

    /**
     * Remove item from cart
     */
    removeItem(pokemonId) {
        const index = this.items.findIndex(
            (item) => item.pokemon.id === pokemonId
        );
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Update quantity
     */
    updateQuantity(pokemonId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(pokemonId);
        }

        const item = this.items.find((item) => item.pokemon.id === pokemonId);
        if (item) {
            item.quantity = quantity;
            return true;
        }
        return false;
    }

    /**
     * Get item count
     */
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Get subtotal
     */
    getSubtotal() {
        return this.items.reduce(
            (sum, item) => sum + item.pokemon.price * item.quantity,
            0
        );
    }

    /**
     * Get tax
     */
    getTax() {
        return this.getSubtotal() * this.TAX_RATE;
    }

    /**
     * Get total
     */
    getTotal() {
        return this.getSubtotal() + this.getTax();
    }

    /**
     * Get billing summary
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
     * Clear cart
     */
    clear() {
        this.items = [];
    }

    /**
     * Get all items
     */
    getItems() {
        return this.items;
    }
}

module.exports = CartModel;
