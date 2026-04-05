/**
 * Cart API Controller - Cart operations
 */

const CartModel = require('../models/cartModel');

class CartController {
    /**
     * Add item to cart
     */
    static addToCart(req, res) {
        try {
            const { pokemon, quantity } = req.body;

            // Initialize cart if needed
            if (!req.session.cart) {
                req.session.cart = new CartModel();
            }

            const item = req.session.cart.addItem(pokemon, quantity || 1);
            res.json({
                success: true,
                item,
                cartCount: req.session.cart.getItemCount(),
                message: `${pokemon.name} added to cart!`,
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Error adding to cart' });
        }
    }

    /**
     * Remove item from cart
     */
    static removeFromCart(req, res) {
        try {
            const { pokemonId } = req.body;

            if (!req.session.cart) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const removed = req.session.cart.removeItem(pokemonId);
            res.json({
                success: removed,
                cartCount: req.session.cart.getItemCount(),
                message: removed ? 'Item removed from cart' : 'Item not found',
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ error: 'Error removing from cart' });
        }
    }

    /**
     * Update cart item quantity
     */
    static updateQuantity(req, res) {
        try {
            const { pokemonId, quantity } = req.body;

            if (!req.session.cart) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const updated = req.session.cart.updateQuantity(
                pokemonId,
                parseInt(quantity)
            );

            res.json({
                success: updated,
                cartCount: req.session.cart.getItemCount(),
                summary: req.session.cart.getBillingSummary(),
                message: updated ? 'Quantity updated' : 'Item not found',
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
            res.status(500).json({ error: 'Error updating quantity' });
        }
    }

    /**
     * Get cart summary
     */
    static getCartSummary(req, res) {
        try {
            if (!req.session.cart) {
                return res.json({
                    items: [],
                    summary: {
                        subtotal: 0,
                        tax: 0,
                        total: 0,
                        itemCount: 0,
                    },
                });
            }

            res.json({
                items: req.session.cart.getItems(),
                summary: req.session.cart.getBillingSummary(),
            });
        } catch (error) {
            console.error('Error getting cart summary:', error);
            res.status(500).json({ error: 'Error getting cart summary' });
        }
    }

    /**
     * Checkout
     */
    static checkout(req, res) {
        try {
            if (!req.session.cart || req.session.cart.getItems().length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const checkoutData = {
                items: req.session.cart.getItems(),
                summary: req.session.cart.getBillingSummary(),
                timestamp: new Date().toISOString(),
            };

            // Clear cart after checkout
            req.session.cart.clear();

            res.json({
                success: true,
                order: checkoutData,
                message: 'Order placed successfully!',
            });
        } catch (error) {
            console.error('Error during checkout:', error);
            res.status(500).json({ error: 'Error processing checkout' });
        }
    }

    /**
     * Clear cart
     */
    static clearCart(req, res) {
        try {
            if (req.session.cart) {
                req.session.cart.clear();
            }

            res.json({
                success: true,
                message: 'Cart cleared',
                cartCount: 0,
            });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ error: 'Error clearing cart' });
        }
    }
}

module.exports = CartController;
