// src/models/itemInventario.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class ItemInventario extends Model {
        static associate(models) {
            ItemInventario.belongsTo(models.Categoria, {
                foreignKey: 'categoriaId'
            });
            ItemInventario.hasMany(models.Log, {
                foreignKey: 'itemInventarioId'
            });
            ItemInventario.hasMany(models.Compra, {
                foreignKey: 'itemInventarioId'
            });
            ItemInventario.belongsToMany(models.ItemMenu, {
                through: 'ItemMenuInventario',
                foreignKey: 'itemInventarioId',
                as: 'itemInventario'
            });
            
        }
    }
    ItemInventario.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: DataTypes.STRING,
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        costo: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        porUnidad: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categorias',
                key: 'id'
            }
        },
        cantxCasillero: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ItemInventario'
    });
    return ItemInventario
}
