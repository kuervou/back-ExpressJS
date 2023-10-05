const { Mesa } = require('../models')

const mesaRepository = {
    create: async (numeroDeMesa, estaLibre) => {
        return await Mesa.create({ numeroDeMesa, estaLibre })
    },

    findAll: async () => {
        return await Mesa.findAll()
    },

    findById: async (id) => {
        return await Mesa.findByPk(id)
    },

    update: async (id, numeroDeMesa, estaLibre) => {
        const mesa = await Mesa.findByPk(id)
        mesa.numeroDeMesa = numeroDeMesa
        mesa.estaLibre = estaLibre
        await mesa.save()
        return mesa
    },

    delete: async (id) => {
        const mesa = await Mesa.findByPk(id)
        if (mesa) {
            await mesa.destroy()
            return true
        }
        return false
    },
}

module.exports = mesaRepository
