/**
 * Market Controller - Main marketplace logic
 */

const PokemonModel = require('../models/pokemonModel');

let pokemonCache = null;
let typesCache = null;
let pricesCache = null;

class MarketController {
    /**
     * Render home/marketplace page
     */
    static async renderMarketplace(req, res) {
        try {
            // Fetch Pokémon list
            if (!pokemonCache) {
                const pokemonList = await PokemonModel.getPokemonList(50);
                const detailedPokemon = await Promise.all(
                    pokemonList.results.map((p) =>
                        PokemonModel.getPokemonDetails(p.name)
                    )
                );
                pokemonCache = detailedPokemon.filter((p) => p !== null);
            }

            // Fetch types
            if (!typesCache) {
                typesCache = await PokemonModel.getAllTypes();
            }

            // Fetch prices
            if (!pricesCache) {
                pricesCache = await PokemonModel.getPrices(20);
            }

            // Add prices to Pokémon
            const pokemonWithPrices = pokemonCache.map((pokemon) => ({
                ...pokemon,
                price: PokemonModel.getPriceForPokemon(pokemon.id, pricesCache),
            }));

            res.render('home', {
                pokemon: pokemonWithPrices,
                types: typesCache,
                cartCount: req.session?.cart?.getItemCount() || 0,
            });
        } catch (error) {
            console.error('Error rendering marketplace:', error);
            res.status(500).render('error', {
                message: 'Error loading marketplace',
                error,
            });
        }
    }

    /**
     * Get Pokémon details via API
     */
    static async getPokemonDetail(req, res) {
        try {
            const { id } = req.params;
            const pokemon = await PokemonModel.getPokemonDetails(id);

            if (!pokemon) {
                return res.status(404).json({ error: 'Pokémon not found' });
            }

            // Get species for evolution chain
            const species = await PokemonModel.getPokemonSpecies(id);
            let evolutions = [];

            if (species?.evolution_chain?.url) {
                const chainId = species.evolution_chain.url
                    .split('/')
                    .filter(Boolean)
                    .pop();
                const chain = await PokemonModel.getEvolutionChain(chainId);
                if (chain) {
                    evolutions = PokemonModel.parseEvolutionChain(chain);
                }
            }

            // Get moves
            let moves = [];
            if (pokemon.moves && pokemon.moves.length > 0) {
                const moveNames = pokemon.moves.map((m) => m.move.name);
                moves = await PokemonModel.getMultipleMoves(moveNames);
            }

            // Get price
            const price = PokemonModel.getPriceForPokemon(
                pokemon.id,
                pricesCache || []
            );

            res.json({
                pokemon,
                price,
                evolutions,
                moves,
            });
        } catch (error) {
            console.error('Error getting Pokémon details:', error);
            res.status(500).json({ error: 'Error fetching Pokémon details' });
        }
    }

    /**
     * Render cart page
     */
    static renderCart(req, res) {
        try {
            const cart = req.session?.cart;
            const items = cart ? cart.getItems() : [];
            const summary = cart ? cart.getBillingSummary() : {};

            res.render('cart', {
                items,
                summary,
                cartCount: items.length,
            });
        } catch (error) {
            console.error('Error rendering cart:', error);
            res.status(500).render('error', {
                message: 'Error loading cart',
                error,
            });
        }
    }

    /**
     * Clear cache (for development)
     */
    static clearCache(req, res) {
        pokemonCache = null;
        typesCache = null;
        pricesCache = null;
        res.json({ message: 'Cache cleared' });
    }
}

module.exports = MarketController;
