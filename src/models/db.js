/**
 * Database Configuration
 * Sequelize ORM setup for PostgreSQL
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration - only create connection if DATABASE_URL is provided
let sequelize = null;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
        },
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
    });
} else {
    // No database URL provided - will use session storage only
    sequelize = null;
}

// Test database connection
async function testConnection() {
    if (!sequelize) {
        console.log('💾 No DATABASE_URL provided - using session storage only');
        return false;
    }
    
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        console.log('💾 Falling back to session storage only');
        return false;
    }
}

// Initialize database
async function initializeDatabase() {
    if (!sequelize) {
        return;
    }
    
    try {
        // Sync all models
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Error synchronizing database:', error);
    }
}

module.exports = {
    sequelize,
    testConnection,
    initializeDatabase,
    Sequelize
};