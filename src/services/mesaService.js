// services/mesaService.js

const { Mesa } = require('../models') // Asumiendo que el modelo Mesa está en la carpeta "models"

const mesaService = {
    addMesa: async function (numeroDeMesa, estaLibre) {
        try {
            const nuevaMesa = await Mesa.create({ numeroDeMesa, estaLibre })
            return nuevaMesa
        } catch (error) {
            throw new Error('Error al añadir la mesa')
        }
    },

    getMesas: async function () {
        try {
            const mesas = await Mesa.findAll()
            return mesas
        } catch (error) {
            throw new Error('Error al obtener las mesas')
        }
    },

    updateMesa: async function (id, numeroDeMesa, estaLibre) {
        try {
            const mesa = await Mesa.findByPk(id)
            if (!mesa) throw new Error('Mesa no encontrada')

            mesa.numeroDeMesa = numeroDeMesa
            mesa.estaLibre = estaLibre
            await mesa.save()

            return mesa
        } catch (error) {
            throw new Error('Error al actualizar la mesa')
        }
    },

    deleteMesa: async function (id) {
        try {
            const mesa = await Mesa.findByPk(id)
            if (!mesa) throw new Error('Mesa no encontrada')

            await mesa.destroy()
            return { message: 'Mesa eliminada correctamente' }
        } catch (error) {
            throw new Error('Error al eliminar la mesa')
        }
    },
}

module.exports = mesaService
