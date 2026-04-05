# 🎮 Poké-Market: Interactive Pokémon E-Commerce Platform

> A gamified e-commerce web application combining **Vanilla JavaScript**, **PokéAPI**, and **Fake Store API** with a retro Pokémon aesthetic.

![Poké-Market Header](https://img.shields.io/badge/Project-Poké%20Market-red?style=flat-square&logo=python)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Technologies](#technologies)
- [Browser Compatibility](#browser-compatibility)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## 🎯 Overview

**Poké-Market** is a showcase project designed to demonstrate modern web development practices using:

- **Framework-free** Vanilla JavaScript (ES Modules)
- **Real-time API integration** from two professional sources
- **Interactive UI/UX** with CSS animations
- **Persistent data management** via localStorage
- **Responsive design** supporting mobile, tablet, and desktop

### Problem Solved

Combines the challenge of integrating real-time data from distinct APIs into a seamless environment while providing a functional e-commerce simulator themed around Pokémon.

### Target Audience

- 🎮 **Pokémon Fans**: Interactive exploration and collection simulation
- 👨‍💻 **Students & Developers**: Learning example for e-commerce logic implementation
- 📚 **Educators**: Real-world showcase of modern web standards

---

## ✨ Features

### 1. **Dynamic Pokémon Catalog**
- Fetches Pokémon data from PokéAPI with high-quality sprites
- Grid display with smooth animations
- Lazy loading for optimized performance

### 2. **Real-Time Search**
- Instant filtering as you type
- Highlights matching Pokémon names
- Case-insensitive search

### 3. **Elemental Type Filtering**
- Dynamic type filter buttons
- Single-type filtering (Fire, Water, Electric, etc.)
- Color-coded type badges with unique animations

### 4. **Master Detail Modal View**
- Comprehensive Pokémon details including:
  - Base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
  - Height and weight
  - All abilities
  - Official artwork sprite display

### 5. **Smart Shopping Cart**
- Add/remove Pokémon from cart
- Track quantities per item
- Prevent duplicates (increment quantity instead)
- Real-time cart count in header

### 6. **Persistent Inventory**
- Automatic localStorage saving
- Cart persists across browser sessions
- Export/import cart functionality

### 7. **Dynamic Pricing System**
- Maps Pokémon IDs to Fake Store API prices
- Realistic product pricing simulation
- Fallback algorithm for pricing consistency

### 8. **Checkout Billing Calculator**
- Automatic subtotal calculation
- 21% VAT (tax) simulation
- Final total with formatted display
- Item-level and order-level breakdowns

### 9. **Interactive Visual Feedback**
- Pokéball bounce animation on add-to-cart
- Success notifications with auto-dismiss
- Loading spinners for async operations
- Smooth page transitions between sections

### 10. **Responsive Poke-Interface**
- **Desktop**: Full-featured marketplace layout with sidebar filters
- **Tablet**: Optimized grid with adjusted spacing
- **Mobile**: Vertical layout with collapsible cart table
- **Landscape**: Special handling for land-oriented mobile devices

---

## 🏗️ System Architecture

```
Poké-Market/
├── index.html              # Main entry point
├── package.json            # Project metadata
├── css/
│   ├── styles.css         # Core styling & component styles
│   ├── animations.css     # Keyframe animations & transitions
│   └── responsive.css     # Media queries for mobile/tablet
├── js/
│   ├── index.js           # Main app initialization & event handlers
│   ├── api.js             # API calls (PokéAPI, Fake Store API)
│   ├── cart.js            # Cart state management & calculations
│   ├── storage.js         # localStorage operations
│   └── ui.js              # DOM rendering & manipulation
└── README.md              # This file
```

### Module Relationships

```
index.js (Main)
├── Imports: api.js, ui.js, storage.js, cart.js
│
├── api.js
│   └── Handles: PokéAPI, Fake Store API calls
│
├── cart.js
│   └── Uses: storage.js (for persistence)
│
├── ui.js
│   └── Uses: api.js (for price calculations)
│
└── storage.js
    └── Manages: localStorage CRUD operations
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (optional, for development server)
- **Python 3** (for simple HTTP server) or any local web server
- **Modern web browser** with ES6+ support

### Quick Start

#### Option 1: Using Python (Recommended)

```bash
# Navigate to project directory
cd path/to/poke-market

# Start development server
python -m http.server 3000 --directory .

# Open browser and navigate to
http://localhost:3000
```

#### Option 2: Using Node.js

```bash
# Install dependencies (if package.json specifies any)
npm install

# Start development server
npm start

# Open browser and navigate to
http://localhost:3000
```

#### Option 3: Direct File Opening

Simply open `index.html` directly in your browser:
```bash
open index.html
```
⚠️ **Note**: Some features may not work due to CORS restrictions with local file protocol.

---

## 💻 Usage

### Main Features Walkthrough

#### Browsing Pokémon

1. **Search**: Type a Pokémon name in the search bar (e.g., "pikachu")
2. **Filter by Type**: Click type buttons (Fire, Water, Electric, etc.)
3. **Clear Filters**: Click "Clear Filters" to reset selections

#### Viewing Details

1. Click "View Details" on any Pokémon card
2. Modal displays complete stats and abilities
3. Click "Add to Cart" or close with ✕ button

#### Shopping

1. **Add Items**: Click "Add to Cart" in modal or on card
2. **View Cart**: Click 🛒 icon in header
3. **Manage Quantity**: Use ± buttons in cart
4. **Remove Items**: Click "Remove" button

#### Checkout

1. View Order Summary with:
   - Subtotal
   - 21% VAT calculation
   - **Total**
2. Click "Proceed to Checkout" to simulate order
3. Cart clears automatically after checkout

### Debugging

Access debug tools in browser console:

```javascript
// View current cart state
debugPoke.cart.getItems()

// Get billing summary
debugPoke.cart.getBillingSummary()

// Access storage functions
debugPoke.storage.getCart()

// Access API functions
debugPoke.api.fetchPokemonTypes()
```

---

## 📁 Project Structure Details

### `index.html`

Main HTML document structure:

```html
<!-- Key Sections -->
<header>        <!-- Navigation & Cart Badge -->
<main>
  <section id="marketplace">  <!-- Grid & Filters -->
  <section id="cart">         <!-- Table & Checkout -->
<div id="pokemon-modal">      <!-- Detail Modal -->
<div id="notification">       <!-- Toast Notifications -->
```

### `css/styles.css`

CSS Variables (customizable theme colors):

```css
:root {
    --primary-red: #FF0000;
    --electric-yellow: #FFCB05;
    --deep-blue: #3B4CCA;
    --background-white: #FFFFFF;
}
```

### `js/` Module Documentation

#### `api.js`

**Key Functions:**

```javascript
// Fetch operations
fetchPokemonList(limit, offset)           // Get paginated Pokémon list
fetchPokemonDetails(idOrName)             // Get full Pokémon details
fetchPokemonTypes()                       // Get all types
fetchPokemonByType(typeName)              // Filter by type

// Pricing
fetchStorePrices(limit)                   // Get Fake Store products
getPriceForPokemon(pokemonId, prices)     // Map Pokémon to price

// Batch operations
fetchMultiplePokemon(idOrNames)           // Parallel fetch
searchPokemon(searchTerm, pokemonList)    // Client-side search
```

#### `cart.js`

**Cart Class Methods:**

```javascript
addItem(pokemon, quantity)        // Add/increment item
removeItem(pokemonId)             // Remove from cart
updateQuantity(pokemonId, qty)    // Update quantity
getItems()                        // Get all items
getItemCount()                    // Total quantity
getSubtotal()                     // Sum before tax
getTax()                          // 21% VAT calculation
getTotal()                        // Subtotal + Tax
getBillingSummary()              // Complete summary object
getCheckoutData()                // Checkout-ready data
```

#### `ui.js`

**Rendering Functions:**

```javascript
renderPokemonGrid(list, prices)           // Render grid cards
renderTypeFilters(types)                  // Render filter buttons
renderPokemonModal(pokemon, price)        // Populate modal
renderCartItems(cartItems)                // Render cart table
updateBillingSummary(summary)             // Update totals
updateCartCount(count)                    // Update badge
showNotification(msg, type, duration)     // Toast notification
switchSection(section)                    // Switch views
```

#### `storage.js`

**LocalStorage Functions:**

```javascript
getCart()                 // Retrieve cart
saveCart(items)           // Save cart
clearCart()               // Empty cart
savePreferences(prefs)    // User preferences
getPreferences()          // Get preferences
exportCartData()          // Export as JSON
importCartData(json)      // Import from JSON
```

---

## 🔌 API Integration

### PokéAPI

**Endpoints Used:**

```
https://pokeapi.co/api/v2/pokemon               // List Pokémon
https://pokeapi.co/api/v2/pokemon/{id}          // Pokémon details
https://pokeapi.co/api/v2/type                  // Type list
https://pokeapi.co/api/v2/type/{name}           // Pokémon by type
```

**Data Structure:**

```json
{
  "id": 25,
  "name": "pikachu",
  "sprites": {
    "official-artwork": {
      "front_default": "url..."
    }
  },
  "types": [{ "type": { "name": "electric" } }],
  "stats": [
    { "stat": { "name": "hp" }, "base_stat": 35 }
  ],
  "height": 4,
  "weight": 60,
  "abilities": [{ "ability": { "name": "static" } }]
}
```

### Fake Store API

**Endpoint Used:**

```
https://fakestoreapi.com/products           // Product list with prices
```

**Price Mapping:**

- Pokémon IDs are mapped to product indices
- Formula: `productIndex = pokemonId % totalProducts`
- Fallback: Generated price if API unavailable

---

## 🎨 Design System

### Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary CTA | Red | `#FF0000` | Main buttons, headings |
| Secondary | Yellow | `#FFCB05` | Highlights, accents |
| Tertiary | Blue | `#3B4CCA` | Secondary buttons, badges |
| Background | White | `#FFFFFF` | Cards, modal |
| Text | Dark Gray | `#1a1a1a` | Body text |

### Typography

```css
h1, h2, h3 {
    font-family: 'Press Start 2P', cursive;  /* Retro heading style */
}

body {
    font-family: 'Roboto', sans-serif;       /* Clean body text */
}
```

### Animations

All animations defined in `animations.css`:

- **pokeball-bounce**: Add-to-cart feedback
- **spin-loading**: Loading spinner
- **fadeIn/fadeOut**: Section transitions
- **slideInUp**: Notification toast
- **glow**: Highlight effect
- **priceFlash**: Price update feedback

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 91+ | ✅ Full | Recommended |
| Firefox 89+ | ✅ Full | - |
| Safari 14+ | ✅ Full | - |
| Edge 91+ | ✅ Full | - |
| IE 11 | ❌ Not Supported | Requires transpilation |

**Required Features:**

- ES6 Modules (`import`/`export`)
- Fetch API
- localStorage API
- CSS Grid & Flexbox
- CSS Custom Properties

---

## 📦 Technologies

- **JavaScript**: ES6+ Modules, async/await
- **CSS3**: Flexbox, Grid, Custom Properties, Animations
- **APIs**: REST (PokéAPI, Fake Store API)
- **Storage**: localStorage (browser-based)
- **No external dependencies**: Completely framework-free

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│          User Interactions (index.js)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Search         Type Filter        View Details    │
│    │                 │                  │          │
│    └─────────────────┼──────────────────┘          │
│                      │                             │
│            api.js (Fetch Data)                     │
│                  │          │                      │
│          PokéAPI │          │ Fake Store API       │
│                  │          │                      │
│          ┌───────▼──────────▼────┐                │
│    cart.js (Update State)        │                │
│    ├─ Add/Remove items           │                │
│    ├─ Calculate totals           │                │
│    └─ Get billing summary        │                │
│          │        │              │                │
│          │    storage.js         │                │
│          │        │              │                │
│          │    localStorage       │                │
│          │        │              │                │
│          └────────┼──────────────┘                │
│                   │                              │
│            ui.js (Render DOM)                    │
│            └─ Update UI elements                │
│                   │                             │
└───────────────────┼─────────────────────────────┘
                    │
           ┌────────▼────────┐
           │  User Sees      │
           │  Updated UI     │
           └─────────────────┘
```

---

## 🚀 Future Enhancements

### Phase 2: Advanced Features

- [ ] **User Accounts**: Login, save multiple carts, order history
- [ ] **Wishlist**: Save favorites for later
- [ ] **Discount Codes**: Apply coupon codes at checkout
- [ ] **Product Reviews**: User ratings & comments
- [ ] **Sorting Options**: By price, name, stats
- [ ] **Advanced Filters**: Multi-type selection, price range
- [ ] **Dark Mode**: Theme switcher implementation
- [ ] **Payments**: Integration with payment processors
- [ ] **Backend Database**: Replace localStorage with backend
- [ ] **Admin Dashboard**: Inventory management

### Phase 3: Technical Improvements

- [ ] **Service Workers**: Offline functionality & caching
- [ ] **Progressive Web App**: Install as app capability
- [ ] **Testing Suite**: Unit & integration tests
- [ ] **Build Optimization**: Webpack bundling & code splitting
- [ ] **Performance**: Lazy loading, image optimization
- [ ] **Analytics**: User behavior tracking
- [ ] **i18n Support**: Multi-language support
- [ ] **API v2 Migration**: Update to latest API versions

---

## 📝 Contributing

Contributions are welcome! Please follow:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** changes (`git commit -am 'Add new feature'`)
4. **Push** to branch (`git push origin feature/your-feature`)
5. **Create** a Pull Request

### Code Style

- Use descriptive variable/function names
- Add JSDoc comments for functions
- ES6 modules and async/await patterns
- Consistent indentation (4 spaces)

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Created for**: Web Development Students & Pokémon Enthusiasts
**Purpose**: Showcase modern web development practices with real-world API integration

---

## 🙏 Acknowledgments

- **PokéAPI**: For providing comprehensive Pokémon data
- **Fake Store API**: For realistic product pricing simulation
- **Pokémon**: For the iconic universe and inspiration

---

## 📞 Support

For issues, questions, or suggestions:

1. Check the existing code comments
2. Review the [API Documentation](#api-documentation)
3. Open an issue with detailed description
4. Check browser console for error messages

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Active Development ✨
