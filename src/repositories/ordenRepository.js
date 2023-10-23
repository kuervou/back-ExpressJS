// src/repositories/ordenRepository.js
const { Orden, Item, Mesa } = require('../models')
const { Op } = require('sequelize')
const db = require('../models')

const ordenRepository = {
    createOrden: async (data, transaction) => {
        return await Orden.create(
            {
                fecha: data.fecha,
                hora: data.hora,
                total: data.total,
                responsable: data.responsable,
                estado: data.estado,
                ocupacion: data.ocupacion,
                observaciones: data.observaciones,
                paga: data.paga,
                clienteId: data.clienteId,
                empleadoId: data.empleadoId,
            },
            { transaction }
        )
    },

    handleMesas: async (data, order, transaction) => {
        if (data.mesas) {
            // si se envian mesas, se crean las relaciones con las mesas
            await order.addMesas(data.mesas, { transaction }) //
            await Mesa.update(
                { libre: false },
                { where: { id: data.mesas }, transaction }
            )
        }
    },

    addMesas: async (orderId, mesas, transaction) => {
        // agregar mesas a la orden y retornar la orden
        const orden = await Orden.findByPk(orderId)
        if (orden) {
            await orden.addMesas(mesas, { transaction })
            await Mesa.update(
                { libre: false },
                { where: { id: mesas }, transaction }
            )
        }

        return orden

    },

    removeMesas: async (orderId, mesas, transaction) => {
        const orden = await Orden.findByPk(orderId)
        if (orden) {
            await orden.removeMesas(mesas, { transaction })
            await Mesa.update(
                { libre: true },
                { where: { id: mesas }, transaction }
            )
        }

        return orden
    },


    findAll: async (options = {}) => {
        const { page = 1, limit = 10, fecha, empleadoId, estado } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (fecha) {
            whereConditions.fecha = {
                [Op.like]: `%${fecha}%`,
            }
        }
        if (empleadoId) {
            whereConditions.empleadoId = empleadoId
        }
        if (estado) {
            whereConditions.estado = estado
        }

        // Consulta para obtener la cuenta correcta
        const count = await Orden.count({
            where: whereConditions,
        })

        const rows = await Orden.findAll({
            where: whereConditions,
            offset,
            limit,
            order: [['fecha', 'ASC']],
            distinct: true, // Esto asegura que sólo se obtenga una fila por orden
            include: [
                {
                    model: Item,
                    as: 'items',
                },
                {
                    model: Mesa,
                    as: 'mesas',
                },
                {
                    model: db.Cliente,
                    as: 'cliente',
                },
                {
                    model: db.Empleado,
                    as: 'empleado',
                },
            ],
        })

        return {
            total: count,
            items: rows,
        }
    },
    update: async (orderId, data, transaction) => {
        return await Orden.update(data, {
        where: {
            id: orderId
        },
        transaction
    })
    },
    deleteOrden: async (id) => {
        return await Orden.destroy({ where: { id: id } })
    },
    findById: async (id, transaction) => {
        return await Orden.findByPk(id, { transaction })
    },
    getOrdenById: async (id) => {
        return await Orden.findByPk(id, {
            include: [
                {
                    model: Item,
                    as: 'items',
                },
            ],
        })
    },
    getItemsOrden: async (id) => {
        return await Orden.findByPk(id, {
            include: [
                {
                    model: Item,
                    as: 'items',
                },
            ],
        })
    }
}

module.exports = ordenRepository