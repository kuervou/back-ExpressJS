'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OrdenMesas', {
            ordenId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Ordenes',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            mesaId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Mesas',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('OrdenMesas');
    }
};
