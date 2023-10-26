const { Cliente } = require('../models')
const { Op } = require('sequelize')

const clienteRepository = {
    create: async (nombre, apellido, telefono) => {
        const nuevoCliente = await Cliente.create({
            nombre,
            apellido,
            telefono,
        })
        return nuevoCliente
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, apellido } = options

        const whereClause = {}
        if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }
        if (apellido) whereClause.apellido = { [Op.like]: `%${apellido}%` }

        //si page o limit son -1, no se aplica paginación
        if (page === -1 || limit === -1) {
            const result = await Cliente.findAndCountAll({
                where: whereClause,
                order: [['nombre', 'ASC']],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const offset = (page - 1) * limit

        const result = await Cliente.findAndCountAll({
            where: whereClause,
            offset,
            limit,
            order: [['nombre', 'ASC']],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, nombre, apellido, telefono, cuenta) => {
        return await Cliente.update(
            { nombre, apellido, telefono, cuenta },
            { where: { id: id } }
        )
    },

    getClienteById: async (id) => {
        return await Cliente.findByPk(id)
    },

    deleteCliente: async (id) => {
        return await Cliente.destroy({
            where: { id: id },
        })
    },

    findByNombreAndApellido: async (nombre, apellido) => {
        return await Cliente.findOne({ where: { nombre, apellido } })
    },
}

module.exports = clienteRepository
