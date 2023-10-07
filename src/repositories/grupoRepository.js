const { Grupo } = require('../models')

const grupoRepository = {
    create: async (nombre) => {
        const nuevoGrupo = await Grupo.create({
            nombre,
        })
        return nuevoGrupo
    },
    findAll: async () => {
        return await Grupo.findAll()
    },

    update: async (id, nombre) => {
        return await Grupo.update({ nombre }, { where: { id: id } })
    },

    getGrupoById: async (id) => {
        return await Grupo.findByPk(id)
    },

    deleteGrupo: async (id) => {
        return await Grupo.destroy({
            where: { id: id },
        })
    },
    findByNombre: async (nombre) => {
        return await Grupo.findOne({ where: { nombre: nombre.toLowerCase() } });
    },
}

module.exports = grupoRepository
