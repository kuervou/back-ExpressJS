'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ModoVenta extends Model {
        static associate(models) {
            // Relación uno-a-muchos con ItemInventario
            ModoVenta.hasMany(models.ItemInventario, {
                foreignKey: 'modoVentaId',
                
            });

            // Relación uno-a-muchos con ItemMenu 
            ModoVenta.hasMany(models.ItemMenu, {
                foreignKey: 'modoVentaId',
               
            });
        }
    }

    ModoVenta.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        PorUnidad: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        enBarra: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ModoVenta',
        timestamps: true
    });

    return ModoVenta;
};
