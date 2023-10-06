const clienteRepository = require('../repositories/clienteRepository')

const clienteService = {
    crearCliente: async (nombre, apellido, telefono) => {
        return await clienteRepository.create(nombre, apellido, telefono)
    },
    getClientes: async function () {
        return await clienteRepository.findAll()
    },

    getClienteById: async (id) => {
        return await clienteRepository.getClienteById(id)
    },

    updateCliente: async (id, nombre, apellido, telefono, cuenta) => {
        return await clienteRepository.update(
            id,
            nombre,
            apellido,
            telefono,
            cuenta
        )
    },
    deleteCliente: async (id) => {
        return await clienteRepository.deleteCliente(id)
    },
}

module.exports = clienteService
