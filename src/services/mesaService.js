const mesaRepository = require('../repositories/mesaRepository')

const mesaService = {
    crearMesa: async (nroMesa, libre) => {
        return await mesaRepository.create(nroMesa, libre)
    },
    getMesas: async function () {
        return await mesaRepository.findAll()
    },

    getMesaById: async (id) => {
        return await mesaRepository.getMesaById(id)
    },

    updateMesa: async (id, nroMesa, libre) => {
        return await mesaRepository.update(id, nroMesa, libre)
    },
    deleteMesa: async (id) => {
        return await mesaRepository.deleteMesa(id)
    },
}

module.exports = mesaService
