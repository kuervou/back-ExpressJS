// migrations/xxxx-xx-xx-create-itemInventario.js
'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ItemsInventario', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: {
                type: Sequelize.STRING,
                allowNull: false
            },
            descripcion: {
                type: Sequelize.STRING
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            costo: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            cantxCasillero: {
                type: Sequelize.INTEGER
            },
            categoriaId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categorias',
                    key: 'id'
                }
            },
            modoVentaId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ModoVentas', 
                    key: 'id'
                },
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('ItemsInventario')
    }
}
