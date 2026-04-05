/**
 * Poké-Market Server
 * Express.js entry point
 * MVC Architecture
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// ============== Configuration ==============
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============== Middleware ==============
// Session setup (for cart management)
app.use(session({
    secret: process.env.SESSION_SECRET || 'poke-market-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============== Routes ==============
const marketRoutes = require('./src/routes/market');
const apiRoutes = require('./src/routes/api');

app.use('/', marketRoutes);
app.use('/api', apiRoutes);

// ============== Error Handling ==============
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const title = status === 404 ? 'Not Found' : 'Server Error';
    console.error('Error:', err);
    res.status(status).render('error', {
        status,
        title,
        message: err.message,
        error: NODE_ENV === 'development' ? err : {},
    });
});

app.use((req, res) => {
    res.status(404).render('error', {
        status: 404,
        title: 'Not Found',
        message: 'Page not found',
        error: {},
    });
});

// ============== Server Start ==============
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════╗
    ║     🎮 Poké-Market Server 🛒      ║
    ║     ⚡ Running on port ${PORT}       ║
    ║     📍 http://localhost:${PORT}     ║
    ║     ${NODE_ENV === 'development' ? '🔧 Development Mode' : '🚀 Production Mode'}        ║
    ╚════════════════════════════════════╝
    `);
});

module.exports = app;
