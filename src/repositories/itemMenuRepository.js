// src/repositories/itemMenuRepository.js
const { ItemMenu } = require('../models')
const { ItemInventario } = require('../models')
const { Grupo } = require('../models')
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
    removeItemInventario: async (itemMenuId, itemInventarioId) => {
        const itemMenu = await ItemMenu.findByPk(itemMenuId)
        const itemInventario = await ItemInventario.findByPk(itemInventarioId)
        if (itemMenu && itemInventario) {
            await itemMenu.removeItemInventario(itemInventario)
        }
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            whereConditions.GrupoId = grupoId
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: [
                {
                    model: Grupo, // Asegúrate de importar este modelo al principio del archivo
                    as: 'grupo',
                },
                {
                    model: ItemInventario, // Asegúrate de importar este modelo al principio del archivo
                    as: 'ItemInventarios', // Por convención, Sequelize usa el nombre plural del modelo
                    through: {
                        attributes: [], // Si quieres excluir todos los campos de la tabla intermedia. Si deseas incluir algunos, coloca sus nombres aquí.
                    },
                },
            ],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },
    //findAllActivos
    findAllActivos: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        whereConditions.Activo = true
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            whereConditions.GrupoId = grupoId
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
    //findAllActivosBasic
    findAllActivosBasic: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        whereConditions.Activo = true
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            whereConditions.GrupoId = grupoId
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: ['grupo'], // incluyendo asociaciones
            //exlcuir campos imagen, activo, grupoId
            attributes: { exclude: ['imagen', 'activo', 'grupoId'] },
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
            include: [
                {
                    model: Grupo, // Asegúrate de importar este modelo al principio del archivo
                    as: 'grupo',
                },
                {
                    model: ItemInventario, // Asegúrate de importar este modelo al principio del archivo
                    as: 'ItemInventarios', // Por convención, Sequelize usa el nombre plural del modelo
                    through: {
                        attributes: [], // Si quieres excluir todos los campos de la tabla intermedia. Si deseas incluir algunos, coloca sus nombres aquí.
                    },
                },
            ],
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
