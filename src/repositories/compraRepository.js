// src/repositories/compraRepository.js

const { Compra } = require('../models')
//const { Op } = require('sequelize')

const compraRepository = {
    create: async (data) => {
        return await Compra.create(data)
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, fecha } = options
        const offset = (page - 1) * limit
        const whereConditions = {}

        if (fecha) {
            whereConditions.fecha = fecha
        }

        if (page === -1 || limit === -1) {
            const result = await Compra.findAndCountAll({
                where: whereConditions,
                include: ['empleado', 'itemInventario'],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await Compra.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            include: ['empleado', 'itemInventario'],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, data) => {
        return await Compra.update(data, { where: { id: id } })
    },

    getCompraById: async (id) => {
        return await Compra.findByPk(id, { include: ['empleado', 'itemInventario'] })
    },

    deleteCompra: async (id) => {
        return await Compra.destroy({
            where: { id: id },
        })
    },
}

module.exports = compraRepository
