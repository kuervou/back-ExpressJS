const grupoRepository = require('../repositories/grupoRepository')

const grupoService = {
    crearGrupo: async (nombre) => {
        return await grupoRepository.create(nombre)
    },
    getGrupos: async function () {
        return await grupoRepository.findAll()
    },

    getGrupoById: async (id) => {
        return await grupoRepository.getGrupoById(id)
    },

    updateGrupo: async (id, nombre) => {
        return await grupoRepository.update(id, nombre)
    },
    deleteGrupo: async (id) => {
        return await grupoRepository.deleteGrupo(id)
    },
}

module.exports = grupoService
