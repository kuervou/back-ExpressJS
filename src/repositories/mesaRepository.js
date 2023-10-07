const { Mesa } = require('../models')

const mesaRepository = {
    create: async (nroMesa, libre) => {
        const nuevaMesa = await Mesa.create({
            nroMesa,
            libre,
        })
        return nuevaMesa
    },
    findAll: async () => {
        return await Mesa.findAll()
    },

    update: async (id, nroMesa, libre) => {
        return await Mesa.update({ nroMesa, libre }, { where: { id: id } })
    },

    getMesaById: async (id) => {
        return await Mesa.findByPk(id)
    },

    deleteMesa: async (id) => {
        return await Mesa.destroy({
            where: { id: id },
        })
    },
    findByNroMesa: async (nroMesa) => {
        return await Mesa.findOne({
            where: {
                nroMesa: nroMesa
            }
        });
    },
}

module.exports = mesaRepository
