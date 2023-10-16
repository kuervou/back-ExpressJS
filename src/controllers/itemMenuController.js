// src/controllers/itemMenuController.js
const itemMenuService = require('../services/itemMenuService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const itemMenuController = {
    crearItemMenu: asyncHandler(async (req, res) => {
        const data = req.body
        //normalizar data.nombre a tolowercase
        // eslint-disable-next-line no-console
        console.log(data);
        if (data.nombre) {
            data.nombre = data.nombre.toLowerCase()
        }
        const itemMenu = await itemMenuService.crearItemMenu(data)
        res.status(HttpCode.CREATED).json({
            message: 'ItemMenu creado',
            itemMenu,
        })
    }),

    getItemsMenu: asyncHandler(async (req, res) => {
        const { page, limit, nombre, grupoId } = req.query

        const options = {}
        if (page) options.page = +page
        if (limit) options.limit = +limit
        if (nombre) options.nombre = nombre
        if (grupoId) options.grupoId = +grupoId

        const itemMenus = await itemMenuService.getItemsMenu(options)
        res.json(itemMenus)
    }),

    //getItemsMenuActivos es una función para obtener los itemsMenu activos
    getItemsMenuActivos: asyncHandler(async (req, res) => {
        const { page, limit, nombre, grupoId } = req.query

        const options = {}
        if (page) options.page = +page
        if (limit) options.limit = +limit
        if (nombre) options.nombre = nombre
        if (grupoId) options.grupoId = +grupoId

        const itemMenus = await itemMenuService.getItemsMenuActivos(options)
        res.json(itemMenus)
    }),

    getItemMenuById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const itemMenu = await itemMenuService.getItemMenuById(id)

        if (!itemMenu) {
            throw new HttpError(HttpCode.NOT_FOUND, 'ItemMenu no encontrado')
        }

        res.status(HttpCode.OK).json(itemMenu)
    }),

    updateItemMenu: asyncHandler(async (req, res) => {
        const id = req.params.id
        const data = req.body
        //normalizar data.nombre a tolowercase
        if (data.nombre) {
            data.nombre = data.nombre.toLowerCase()
        }
        const itemMenu = await itemMenuService.updateItemMenu(id, data)

        if (itemMenu[0] === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'ItemMenu no encontrado')
        }

        res.status(HttpCode.OK).json({
            message: 'ItemMenu actualizado',
        })
    }),

    deleteItemMenu: asyncHandler(async (req, res) => {
        const id = req.params.id

        const itemMenu = await itemMenuService.deleteItemMenu(id)

        if (!itemMenu) {
            throw new HttpError(HttpCode.NOT_FOUND, 'ItemMenu no encontrado')
        }

        res.status(HttpCode.OK).json({
            message: 'ItemMenu desactivado',
            itemMenu,
        })
    }),
}

module.exports = itemMenuController
