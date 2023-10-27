// src/services/compraService.js

const compraRepository = require('../repositories/compraRepository')
//const { HttpError, HttpCode } = require('../error-handling/http_error')

const compraService = {
    crearCompra: async (data) => {
        return await compraRepository.create(data)
    },

    getCompras: async function (options = {}) {
        return await compraRepository.findAll(options)
    },

    getCompraById: async (id) => {
        return await compraRepository.getCompraById(id)
    },

    updateCompra: async (id, data) => {
        return await compraRepository.update(id, data)
    },

    deleteCompra: async (id) => {
        return await compraRepository.deleteCompra(id)
    },
}

module.exports = compraService
