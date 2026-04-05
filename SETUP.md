# 🚀 Poké-Market Quick Start Guide

Get the app running in **60 seconds**!

## Step 1: Start Local Server

### Option A: Python (Recommended)
```bash
cd path/to/poke-market
python -m http.server 3000 --directory .
```

### Option B: Node.js with http-server
```bash
npm install -g http-server
http-server . -p 3000
```

### Option C: VS Code Live Server
- Right-click `index.html` → "Open with Live Server"

## Step 2: Open in Browser

Navigate to: **http://localhost:3000**

---

## ✅ What You Should See

✓ **Header** with Poké-Market logo and cart button  
✓ **Pokémon Grid** with colorful cards showing 50 Pokémon  
✓ **Filter Panel** on the left with search and type filters  
✓ **Cart Section** accessible via header navigation  

---

## 🎮 Try These Features

### 1. **Search**
Type "pikachu" in the search box → See results instantly

### 2. **Filter by Type**
Click "Electric" type button → See only electric Pokémon

### 3. **View Details**
Click any Pokémon card → Modal shows full stats

### 4. **Add to Cart**
From modal, click "Add to Cart" → See notification ✨

### 5. **Checkout**
Go to cart (🛒) → Adjust quantities → Click "Proceed to Checkout"

---

## 🐛 Troubleshooting

### "Cannot load Pokémon" Error
- **Cause**: PokéAPI not reachable (network issue)
- **Fix**: Refresh page, check internet connection

### Cart data disappears
- **Cause**: Browser localStorage disabled
- **Fix**: Enable localStorage in browser settings

### Sprites not loading
- **Cause**: Image loading delay from PokéAPI
- **Fix**: Refresh page, wait for images to load

### Modal doesn't open
- **Cause**: JavaScript error, try hard refresh
- **Fix**: Press Ctrl+F5 or clear browser cache

---

## 📱 Responsive Testing

Test on different screen sizes:
- **Desktop**: 1920×1080 (Full experience)
- **Tablet**: 768×1024 (Optimized layout)
- **Mobile**: 375×812 (Vertical layout)

Use browser DevTools: F12 → "Toggle device toolbar"

---

## 🔧 Customization

### Change Colors
Edit `css/styles.css`:
```css
:root {
    --primary-red: #FF0000;        /* Change this */
    --electric-yellow: #FFCB05;    /* Or this */
    --deep-blue: #3B4CCA;          /* Or this */
}
```

### Adjust Cart Tax
Edit `js/cart.js`:
```javascript
this.TAX_RATE = 0.21;  // Change from 21% to your value
```

### Modify Initial Pokémon Count
Edit `js/index.js` in `init()` function:
```javascript
allPokemon = await api.fetchPokemonList(50);  // Change 50 to desired count
```

---

## 📊 Project Stats

- **Files**: 10 core files
- **Lines of Code**: ~1500 (JS) + ~800 (CSS)
- **Dependencies**: 0 (completely framework-free!)
- **Bundle Size**: ~50KB (minified)
- **Load Time**: ~2-3 seconds (API dependent)

---

## 💡 Pro Tips

1. **Debug Mode**: Open console and type `debugPoke` to access internal state
2. **Export Cart**: See exported JSON format for integration ideas
3. **Batch Operations**: Check how `fetchMultiplePokemon()` uses Promise.all
4. **Error Handling**: All API calls have try-catch for graceful failures

---

## 🎓 Learning Outcomes

This project teaches:
- ✅ ES6 Module patterns
- ✅ Async/await & Promise handling
- ✅ REST API integration
- ✅ localStorage persistence
- ✅ Event delegation & listeners
- ✅ CSS Grid & Flexbox
- ✅ CSS animations & transitions
- ✅ Responsive web design
- ✅ State management
- ✅ Component-based architecture

---

## 📚 Next Steps

1. **Explore the code**: Start with `js/index.js` to understand flow
2. **Modify features**: Try adding a discount code system
3. **Build similar apps**: Use the modules as templates
4. **Deploy**: Upload to GitHub Pages or Netlify
5. **Extend**: Add backend database integration

---

## ❓ FAQ

**Q: Can I use this code for my project?**  
A: Yes! It's ISC licensed. Feel free to use, modify, and distribute.

**Q: How do I add more Pokémon?**  
A: Change the `limit` parameter in `fetchPokemonList(50)` to a higher number.

**Q: Can this work offline?**  
A: Not initially (needs API calls), but can add Service Workers for offline caching.

**Q: Is this production-ready?**  
A: It's a learning project. For production, add error handling, testing, and monitoring.

**Q: How do I deploy this?**  
A: Upload to GitHub Pages, Netlify, Vercel, or any static host.

---

**Happy coding! 🎮⚡**

For complete documentation, see [README.md](./README.md)
