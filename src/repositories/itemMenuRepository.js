// src/repositories/itemMenuRepository.js
const { ItemMenu } = require('../models')
const { ItemInventario } = require('../models')
const { Op } = require('sequelize')

const itemMenuRepository = {
    create: async (data) => {
        const newItemMenu = await ItemMenu.create(data)
        return newItemMenu
    },
    addItemInventario: async (itemMenuId, itemInventarioId) => {
        const itemMenu = await ItemMenu.findByPk(itemMenuId)
        const itemInventario = await ItemInventario.findByPk(itemInventarioId)
        if (itemMenu && itemInventario) {
            await itemMenu.addItemInventario(itemInventario)
        }
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: ['grupo'], // incluyendo asociaciones
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },
    //findAllActivos
    findAllActivos: async (options = {}) => {
        const { page = 1, limit = 10, nombre } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        whereConditions.Activo = true
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: ['grupo'], // incluyendo asociaciones
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },
    update: async (id, data) => {
        return await ItemMenu.update(data, { where: { id: id } })
    },
    getItemMenuById: async (id) => {
        return await ItemMenu.findByPk(id, {
            include: ['grupo'], // incluyendo asociaciones
        })
    },
    deleteItemMenu: async (id) => {
        //borrado logico
        return await ItemMenu.update({ activo: false }, { where: { id: id } })
    },
    findByNombre: async (nombre) => {
        return await ItemMenu.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
}

module.exports = itemMenuRepository
