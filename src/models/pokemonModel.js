/**
 * Pokémon Model - API calls and data handling
 */

const POKEMON_API = 'https://pokeapi.co/api/v2';
const FAKE_STORE_API = 'https://fakestoreapi.com/products';

class PokemonModel {
    /**
     * Fetch list of Pokémon
     */
    static async getPokemonList(limit = 50, offset = 0) {
        try {
            const response = await fetch(
                `${POKEMON_API}/pokemon?limit=${limit}&offset=${offset}`
            );
            if (!response.ok) throw new Error('Failed to fetch Pokémon list');
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            return { results: [] };
        }
    }

    /**
     * Fetch detailed Pokémon data
     */
    static async getPokemonDetails(idOrName) {
        try {
            const response = await fetch(`${POKEMON_API}/pokemon/${idOrName}`);
            if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${idOrName}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching Pokémon ${idOrName}:`, error);
            return null;
        }
    }

    /**
     * Fetch all types
     */
    static async getAllTypes() {
        try {
            const response = await fetch(`${POKEMON_API}/type`);
            if (!response.ok) throw new Error('Failed to fetch types');
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching types:', error);
            return [];
        }
    }

    /**
     * Fetch Pokémon by type
     */
    static async getPokemonByType(typeName) {
        try {
            const response = await fetch(`${POKEMON_API}/type/${typeName}`);
            if (!response.ok) throw new Error(`Failed to fetch type: ${typeName}`);
            const data = await response.json();
            return data.pokemon.map((item) => item.pokemon);
        } catch (error) {
            console.error(`Error fetching Pokémon by type ${typeName}:`, error);
            return [];
        }
    }

    /**
     * Fetch species data (for evolution chain)
     */
    static async getPokemonSpecies(idOrName) {
        try {
            const response = await fetch(`${POKEMON_API}/pokemon-species/${idOrName}`);
            if (!response.ok) throw new Error(`Failed to fetch species: ${idOrName}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching species ${idOrName}:`, error);
            return null;
        }
    }

    /**
     * Fetch evolution chain
     */
    static async getEvolutionChain(chainId) {
        try {
            const response = await fetch(`${POKEMON_API}/evolution-chain/${chainId}`);
            if (!response.ok) throw new Error(`Failed to fetch evolution chain: ${chainId}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching evolution chain ${chainId}:`, error);
            return null;
        }
    }

    /**
     * Parse evolution chain
     */
    static parseEvolutionChain(chainData) {
        const evolutions = [];

        const processChain = (chain, level = 1) => {
            if (chain.species) {
                evolutions.push({
                    name: chain.species.name,
                    level: level,
                    trigger: chain.evolution_details?.[0]?.trigger?.name || 'unknown',
                });
            }
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                chain.evolves_to.forEach((nextChain) => {
                    processChain(nextChain, level + 1);
                });
            }
        };

        if (chainData?.chain) {
            processChain(chainData.chain);
        }

        return evolutions;
    }

    /**
     * Fetch move details
     */
    static async getMoveDetails(moveName) {
        try {
            const response = await fetch(`${POKEMON_API}/move/${moveName}`);
            if (!response.ok) throw new Error(`Failed to fetch move: ${moveName}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching move ${moveName}:`, error);
            return null;
        }
    }

    /**
     * Fetch multiple moves (max 10)
     */
    static async getMultipleMoves(moveNames) {
        const limitedMoves = moveNames.slice(0, 10);
        const promises = limitedMoves.map((name) => this.getMoveDetails(name));
        const results = await Promise.all(promises);
        return results.filter((move) => move !== null);
    }

    /**
     * Get pricing from Fake Store API
     */
    static async getPrices(limit = 20) {
        try {
            const response = await fetch(`${FAKE_STORE_API}?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch prices');
            return await response.json();
        } catch (error) {
            console.error('Error fetching prices:', error);
            return [];
        }
    }

    /**
     * Map Pokémon ID to price
     */
    static getPriceForPokemon(pokemonId, prices) {
        if (!prices || prices.length === 0) {
            return parseFloat((10 + (pokemonId % 290)).toFixed(2));
        }
        const priceObject = prices[pokemonId % prices.length];
        return priceObject.price;
    }

    /**
     * Search Pokémon locally
     */
    static searchPokemon(searchTerm, pokemonList) {
        if (!searchTerm.trim()) return pokemonList;
        const term = searchTerm.toLowerCase();
        return pokemonList.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(term)
        );
    }
}

module.exports = PokemonModel;
