// src/models/itemMenu.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ItemMenu extends Model {
        static associate(models) {
            ItemMenu.belongsTo(models.Grupo, {
                foreignKey: 'grupoId',
                as: 'grupo'
            });
            ItemMenu.belongsTo(models.ModoVenta, {
                foreignKey: 'modoVentaId',
                as: 'modoVenta'
            });
            
            ItemMenu.hasMany(models.Item, {
                foreignKey: 'itemMenuId',
                as: 'items'
            });
        }
    }

    ItemMenu.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Descripcion: DataTypes.STRING,
        Precio: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        Imagen: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        grupoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Grupos',
                key: 'id'
            }
        },
        modoVentaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ModoVentas',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ItemMenu',
        timestamps: false
    });

    return ItemMenu;
};
