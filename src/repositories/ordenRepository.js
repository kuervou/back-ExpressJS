// src/repositories/ordenRepository.js
const { Orden, Item, Mesa, ItemMenu, Grupo } = require('../models')
const { Op, literal } = require('sequelize')
const db = require('../models')
const { EXCLUDED_GROUPS } = require('../constants/grupos/grupos')
const { ESTADOS } = require('../constants/estados/estados')

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
        const { page = 1, limit = 10, fecha, empleadoId, estado, mesaId } = options
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


        const include = [
            {
                model: Item,
                as: 'items',
                include: [
                    {
                        model: ItemMenu,
                        as: 'itemMenu',
                        attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                        include: [
                            {
                                model: Grupo,
                                as: 'grupo',
                                attributes: ['nombre'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                            },
                        ],
                    },
                ],
            },
            {
                model: db.Cliente,
                as: 'cliente',
            },
            {
                model: db.Empleado,
                as: 'empleado',
            },
        ]

        if(mesaId) {
            include.push({
                model: Mesa,
                as: 'mesas',
                where: { id: mesaId },
                through: { attributes: [] }
            });
        }


        const result = await Orden.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['fecha', 'DESC']],
            distinct: true,
            include: include, 
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    findAllCaja: async () => {
        const whereConditions = {}

        //agregar a la condicion que el estado sea ESTADOS.EN_COCINA, PARA_ENTREGAR, POR_CONFIRMAR
        whereConditions[Op.or] = [
            { estado: { [Op.in]: [ESTADOS.EN_COCINA, ESTADOS.PARA_ENTREGAR, ESTADOS.POR_CONFIRMAR] } },
            { estado: ESTADOS.ENTREGADA, paga: false }
        ];
        

        // Consulta para obtener la cuenta correcta
        const count = await Orden.count({
            where: whereConditions,
        })

        const rows = await Orden.findAll({
            where: whereConditions,
            order: [
                [
                    literal(`
                    CASE 
                        WHEN estado = '${ESTADOS.POR_CONFIRMAR}' THEN 1 
                        WHEN estado = '${ESTADOS.PARA_ENTREGAR}' THEN 2 
                        ELSE 3 
                    END
                `),
                    'ASC',
                ],
                ['fecha', 'DESC'],
            ],
            distinct: true,
            include: [
                {
                    model: Item,
                    as: 'items',
                    order: [
                        literal(`CASE 
                            WHEN grupo.nombre = '${EXCLUDED_GROUPS.BEBIDAS}' THEN 1
                            WHEN grupo.nombre = '${EXCLUDED_GROUPS.TRAGOS}' THEN 2
                            ELSE 3 END ASC`),
                    ],
                    include: [
                        {
                            model: ItemMenu,
                            as: 'itemMenu',
                            attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                            include: [
                                {
                                    model: Grupo,
                                    as: 'grupo',
                                    attributes: ['nombre'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                                },
                            ],
                        },
                    ],
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
                id: orderId,
            },
            transaction,
        })
    },

    countOcupacion: async () => {
        // Obteniendo la suma de ocupación para los estados deseados
        const totalOcupacion = await Orden.sum('ocupacion', {
            where: {
                estado: {
                    [Op.in]: [
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.EN_COCINA,
                    ],
                },
            },
        })

        return totalOcupacion
    },

    deleteOrden: async (id) => {
        //la orden se elimina logicamente, es decir se cambia el estado a ESTADOS.CANCELADA
        return await Orden.update(
            { estado: ESTADOS.CANCELADA },
            { where: { id: id } }
        )
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
    },

    updatePaga: async (id, paga, transaction) => {
        return await Orden.update(
            { paga: paga },
            {
                where: {
                    id: id,
                },
                transaction,
            }
        )
    },
}

module.exports = ordenRepository
