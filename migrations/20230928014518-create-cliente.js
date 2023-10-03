// migrations/xxxx-xx-xx-create-cliente.js
'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Clientes', {
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
            apellido: {
                type: Sequelize.STRING,
                allowNull: false
            },
            telefono: {
                type: Sequelize.STRING
            },
            cuenta: {
                type: Sequelize.FLOAT
            }
        })
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Clientes')
    }
}
