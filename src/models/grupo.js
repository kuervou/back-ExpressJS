// src/models/grupo.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Grupo extends Model {
        static associate(models) {
            Grupo.hasMany(models.ItemMenu, {
                foreignKey: 'grupoId',
                as: 'grupo'
            });
        }
    }

    Grupo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Grupo',
        timestamps: true
    });

    return Grupo;
};
