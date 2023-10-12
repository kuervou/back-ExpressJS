const { Cliente } = require('../models')

const clienteRepository = {
    create: async (nombre, apellido, telefono) => {
        const nuevoCliente = await Cliente.create({
            nombre,
            apellido,
            telefono,
        })
        return nuevoCliente
    },
    findAll: async () => {
        return await Cliente.findAll()
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
