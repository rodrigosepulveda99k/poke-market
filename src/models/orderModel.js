/**
 * Order Model - Database persistence for orders
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Anonymous'
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'completed'
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'cash'
    },
    orderData: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Complete order data including items'
    }
}, {
    tableName: 'orders',
    indexes: [
        {
            fields: ['orderNumber']
        },
        {
            fields: ['createdAt']
        }
    ]
});

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    pokemonId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pokemonName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_items'
});

// Define associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Static methods
Order.generateOrderNumber = function() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PKM-${timestamp}-${random}`;
};

Order.createOrder = async function(orderData, items) {
    const transaction = await sequelize.transaction();

    try {
        // Create order
        const order = await Order.create({
            orderNumber: Order.generateOrderNumber(),
            totalAmount: orderData.total,
            taxAmount: orderData.tax,
            subtotal: orderData.subtotal,
            orderData: {
                items: items,
                summary: orderData,
                timestamp: new Date().toISOString()
            }
        }, { transaction });

        // Create order items
        const orderItems = items.map(item => ({
            orderId: order.id,
            pokemonId: item.pokemon.id,
            pokemonName: item.pokemon.name,
            quantity: item.quantity,
            unitPrice: item.pokemon.price,
            totalPrice: item.pokemon.price * item.quantity
        }));

        await OrderItem.bulkCreate(orderItems, { transaction });

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = { Order, OrderItem };