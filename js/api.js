/**
 * API Module - Handles all asynchronous fetch requests
 * Uses PokéAPI for Pokémon data and Fake Store API for pricing
 */

const API_CONFIG = {
    POKEMON_API: 'https://pokeapi.co/api/v2',
    FAKE_STORE_API: 'https://fakestoreapi.com/products',
};

/**
 * Fetches a list of Pokémon with pagination
 * @param {number} limit - Number of Pokémon to fetch
 * @param {number} offset - Pagination offset
 * @returns {Promise<Array>} Array of Pokémon objects
 */
export const fetchPokemonList = async (limit = 50, offset = 0) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/pokemon?limit=${limit}&offset=${offset}`
        );
        if (!response.ok) throw new Error('Failed to fetch Pokémon list');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        return [];
    }
};

/**
 * Fetches detailed data for a specific Pokémon
 * @param {string|number} idOrName - Pokémon ID or name
 * @returns {Promise<Object>} Pokémon object with full details
 */
export const fetchPokemonDetails = async (idOrName) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/pokemon/${idOrName}`
        );
        if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${idOrName}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching Pokémon details for ${idOrName}:`, error);
        return null;
    }
};

/**
 * Fetches all Pokémon types for filtering
 * @returns {Promise<Array>} Array of type objects
 */
export const fetchPokemonTypes = async () => {
    try {
        const response = await fetch(`${API_CONFIG.POKEMON_API}/type`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon types');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokémon types:', error);
        return [];
    }
};

/**
 * Fetches Pokémon by type
 * @param {string} typeName - Name of the type
 * @returns {Promise<Array>} Array of Pokémon with that type
 */
export const fetchPokemonByType = async (typeName) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/type/${typeName}`
        );
        if (!response.ok) throw new Error(`Failed to fetch type: ${typeName}`);
        const data = await response.json();
        return data.pokemon.map((item) => item.pokemon);
    } catch (error) {
        console.error(`Error fetching Pokémon for type ${typeName}:`, error);
        return [];
    }
};

/**
 * Fetches prices from Fake Store API
 * Used to simulate realistic product pricing
 * @param {number} limit - Number of products to fetch
 * @returns {Promise<Array>} Array of product objects with prices
 */
export const fetchStorePrices = async (limit = 20) => {
    try {
        const response = await fetch(`${API_CONFIG.FAKE_STORE_API}?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch store prices');
        return await response.json();
    } catch (error) {
        console.error('Error fetching store prices:', error);
        return [];
    }
};

/**
 * Maps a Pokémon ID to a price from the Fake Store API
 * Uses modulo to cycle through available prices
 * @param {number} pokemonId - ID of the Pokémon
 * @param {Array} prices - Array of price objects from Fake Store API
 * @returns {number} Price in USD
 */
export const getPriceForPokemon = (pokemonId, prices) => {
    if (!prices || prices.length === 0) {
        // Fallback: generate a price based on Pokémon ID
        return parseFloat((10 + (pokemonId % 290)).toFixed(2));
    }
    const priceObject = prices[pokemonId % prices.length];
    return priceObject.price;
};

/**
 * Batch fetch Pokémon details
 * @param {Array<string|number>} idOrNames - Array of Pokémon IDs or names
 * @returns {Promise<Array>} Array of Pokémon objects
 */
export const fetchMultiplePokemon = async (idOrNames) => {
    const promises = idOrNames.map((id) => fetchPokemonDetails(id));
    const results = await Promise.all(promises);
    return results.filter((pokemon) => pokemon !== null);
};

/**
 * Searches for Pokémon by name (client-side filtering would be more efficient)
 * This function fetches a large set and returns locally searched results
 * @param {string} searchTerm - Name to search for
 * @param {Array} pokemonList - List of Pokémon to search through
 * @returns {Promise<Array>} Filtered Pokémon array
 */
export const searchPokemon = (searchTerm, pokemonList) => {
    if (!searchTerm.trim()) return pokemonList;
    const term = searchTerm.toLowerCase();
    return pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(term)
    );
};

/**
 * Fetches evolution chain for a specific Pokémon
 * @param {number} evolutionChainId - ID of the evolution chain
 * @returns {Promise<Object>} Evolution chain object
 */
export const fetchEvolutionChain = async (evolutionChainId) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/evolution-chain/${evolutionChainId}`
        );
        if (!response.ok) throw new Error(`Failed to fetch evolution chain: ${evolutionChainId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching evolution chain ${evolutionChainId}:`, error);
        return null;
    }
};

/**
 * Fetches Pokémon species data (includes evolution chain ID)
 * @param {string|number} idOrName - Pokémon ID or name
 * @returns {Promise<Object>} Species object with evolution info
 */
export const fetchPokemonSpecies = async (idOrName) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/pokemon-species/${idOrName}`
        );
        if (!response.ok) throw new Error(`Failed to fetch species: ${idOrName}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching species for ${idOrName}:`, error);
        return null;
    }
};

/**
 * Fetches move details
 * @param {string|number} moveIdOrName - Move ID or name
 * @returns {Promise<Object>} Move object with details
 */
export const fetchMoveDetails = async (moveIdOrName) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/move/${moveIdOrName}`
        );
        if (!response.ok) throw new Error(`Failed to fetch move: ${moveIdOrName}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching move ${moveIdOrName}:`, error);
        return null;
    }
};

/**
 * Fetches multiple move details in parallel
 * @param {Array<string>} moveNames - Array of move names
 * @returns {Promise<Array>} Array of move objects (max 10)
 */
export const fetchMultipleMoves = async (moveNames) => {
    const limitedMoves = moveNames.slice(0, 10); // Limit to 10 moves to avoid too many API calls
    const promises = limitedMoves.map((name) => fetchMoveDetails(name));
    const results = await Promise.all(promises);
    return results.filter((move) => move !== null);
};

/**
 * Fetches item details
 * @param {string|number} itemIdOrName - Item ID or name
 * @returns {Promise<Object>} Item object
 */
export const fetchItemDetails = async (itemIdOrName) => {
    try {
        const response = await fetch(
            `${API_CONFIG.POKEMON_API}/item/${itemIdOrName}`
        );
        if (!response.ok) throw new Error(`Failed to fetch item: ${itemIdOrName}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching item ${itemIdOrName}:`, error);
        return null;
    }
};

/**
 * Fetches all moves for a Pokémon
 * @param {Array} movesArray - Array of move objects from Pokémon details
 * @returns {Promise<Array>} Detailed move objects
 */
export const getPokemonMoves = async (movesArray) => {
    if (!movesArray || movesArray.length === 0) return [];
    const moveNames = movesArray.map((m) => m.move.name);
    return fetchMultipleMoves(moveNames);
};

/**
 * Extracts evolution chain details
 * @param {Object} chainData - Evolution chain data object
 * @returns {Array} Array of evolution objects
 */
export const parseEvolutionChain = (chainData) => {
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
};

export default {
    fetchPokemonList,
    fetchPokemonDetails,
    fetchPokemonTypes,
    fetchPokemonByType,
    fetchStorePrices,
    getPriceForPokemon,
    fetchMultiplePokemon,
    searchPokemon,
    fetchEvolutionChain,
    fetchPokemonSpecies,
    fetchMoveDetails,
    fetchMultipleMoves,
    fetchItemDetails,
    getPokemonMoves,
    parseEvolutionChain,
};
