const mesaRepository = require('../repositories/mesaRepository')

const mesaService = {
    addMesa: async function (numeroDeMesa, estaLibre) {
        try {
            return await mesaRepository.create(numeroDeMesa, estaLibre)
        } catch (error) {
            throw new Error('Error al añadir la mesa')
        }
    },

    getMesas: async function () {
        try {
            return await mesaRepository.findAll()
        } catch (error) {
            throw new Error('Error al obtener las mesas')
        }
    },

    updateMesa: async function (id, numeroDeMesa, estaLibre) {
        try {
            const mesa = await mesaRepository.findById(id)
            if (!mesa) throw new Error('Mesa no encontrada')

            return await mesaRepository.update(id, numeroDeMesa, estaLibre)
        } catch (error) {
            throw new Error('Error al actualizar la mesa')
        }
    },

    deleteMesa: async function (id) {
        try {
            const wasDeleted = await mesaRepository.delete(id)
            if (!wasDeleted) throw new Error('Mesa no encontrada')

            return { message: 'Mesa eliminada correctamente' }
        } catch (error) {
            throw new Error('Error al eliminar la mesa')
        }
    },
}

module.exports = mesaService
