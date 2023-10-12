const { ItemInventario, Categoria } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const itemInventarioRepository = {
    create: async (
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        const nuevoItemInventario = await ItemInventario.create({
            nombre,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId,
        })
        return nuevoItemInventario
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, categoriaId } = options

        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`, // Cambiado a Op.like para MySQL
            }
        }
        if (categoriaId) {
            whereConditions.categoriaId = categoriaId
        }

        return await ItemInventario.findAll({
            where: whereConditions,
            offset,
            limit,
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                },
            ],
            attributes: {
                exclude: ['categoriaId', 'porUnidad'],
                include: [[sequelize.col('porUnidad'), 'ventaPorUnidad']],
            },
        })
    },

    update: async (
        id,
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        return await ItemInventario.update(
            {
                nombre,
                descripcion,
                stock,
                costo,
                cantxCasillero,
                porUnidad,
                categoriaId,
            },
            { where: { id: id } }
        )
    },

    getItemInventarioById: async (id) => {
        return await ItemInventario.findByPk(id, {
            include: [
                {
                    //para mostrar la categoria de forma más limpia
                    model: Categoria,
                    as: 'categoria',
                },
            ],
            attributes: {
                exclude: ['categoriaId', 'porUnidad'],
                include: [[sequelize.col('porUnidad'), 'ventaPorUnidad']], //para darle un nombre más descriptivo al atributo
            },
        })
    },

    deleteItemInventario: async (id) => {
        return await ItemInventario.destroy({
            where: { id: id },
        })
    },
    findByNombre: async (nombre) => {
        return await ItemInventario.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
}

module.exports = itemInventarioRepository
