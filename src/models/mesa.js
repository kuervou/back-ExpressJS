'use strict'

// Importaciones requeridas
const { Model } = require('sequelize')

// Exportar el modelo
module.exports = (sequelize, DataTypes) => {
    // Definición de la clase Mesa, que representa una mesa en un restaurante o similar.
    class Mesa extends Model {}

    // Inicialización del modelo con sus campos
    Mesa.init(
        {
            // `numeroDeMesa` representa el número identificador de la mesa.
            numeroDeMesa: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            // `estaLibre` indica si la mesa está disponible o no.
            estaLibre: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Mesa',
        }
    )

    return Mesa
}
