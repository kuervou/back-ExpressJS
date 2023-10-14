const { Grupo } = require('../models')
const { Op } = require('sequelize')

const grupoRepository = {
    create: async (nombre) => {
        const nuevoGrupo = await Grupo.create({
            nombre,
        })
        return nuevoGrupo
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre } = options

        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`, // Búsqueda insensible a mayúsculas/minúsculas
            }
        }

        const result = await Grupo.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['nombre', 'ASC']],
        })

        return {
            total: result.count,
            items: result.rows,
        }
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
        return await Grupo.findOne({ where: { nombre: nombre.toLowerCase() } })
    },
}

module.exports = grupoRepository
