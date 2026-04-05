/**
 * Database Configuration
 * Sequelize ORM setup for PostgreSQL
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/poke_market', {
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
    }
});

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        return false;
    }
}

// Initialize database
async function initializeDatabase() {
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