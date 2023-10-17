// src/controllers/itemMenuController.js
const itemMenuService = require('../services/itemMenuService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const itemMenuController = {
    crearItemMenu: asyncHandler(async (req, res) => {
        const data = req.body
        //normalizar data.nombre a tolowercase

        if (data.nombre) {
            data.nombre = data.nombre.toLowerCase()
        }

        if (data.itemsInventario) {
            //validar que si data.itemsInventario existe sea un array que no contenga id repetidos
            const ids = data.itemsInventario.map((item) => item.id)
            const uniqueIds = [...new Set(ids)]
            if (ids.length !== uniqueIds.length) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El array de itemsInventario contiene ids repetidos'
                )
            }

            //si data.porUnidad no existe, solicitar que se envíe
            if (data.porUnidad === undefined) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El campo porUnidad es requerido cuando se envía itemsInventario'
                )
            }
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

    //getItemsMenuActivosBasic es una función para obtener los itemsMenu activos con menos campos en la response (sirve para el menu de los mozos por ejemplo)
    getItemsMenuActivosBasic: asyncHandler(async (req, res) => {
        const { page, limit, nombre, grupoId } = req.query

        const options = {}
        if (page) options.page = +page
        if (limit) options.limit = +limit
        if (nombre) options.nombre = nombre
        if (grupoId) options.grupoId = +grupoId

        const itemMenus =
            await itemMenuService.getItemsMenuActivosBasic(options)
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

        if (data.itemsInventario) {
            //validar que si data.itemsInventario existe sea un array que no contenga id repetidos
            const ids = data.itemsInventario.map((item) => item.id)
            const uniqueIds = [...new Set(ids)]
            if (ids.length !== uniqueIds.length) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El array de itemsInventario contiene ids repetidos'
                )
            }

            //si data.porUnidad no existe, solicitar que se envíe
            if (data.porUnidad === undefined) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El campo porUnidad es requerido cuando se envía itemsInventario'
                )
            }
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

    //removeItemsInventario función que dado un itemMenu y un array de itemInventarioId desvincula los itemInventarioId con itemMenu en la tabla intermedia
    removeItemsInventario: asyncHandler(async (req, res) => {
        const id = req.params.id
        const data = req.body
        const itemMenu = await itemMenuService.removeItemsInventario(id, data)

        if (!itemMenu) {
            throw new HttpError(HttpCode.NOT_FOUND, 'ItemMenu no encontrado')
        }

        res.status(HttpCode.OK).json({
            message: 'ItemMenu actualizado',
            itemMenu,
        })
    }),

    //addItemsInventario función que dado un itemMenu y un array de itemInventarioId vincula los itemInventarioId con itemMenu en la tabla intermedia
    addItemsInventario: asyncHandler(async (req, res) => {
        const id = req.params.id
        const data = req.body
        const itemMenu = await itemMenuService.addItemsInventario(id, data)

        if (!itemMenu) {
            throw new HttpError(HttpCode.NOT_FOUND, 'ItemMenu no encontrado')
        }

        res.status(HttpCode.OK).json({
            message: 'ItemMenu actualizado',
            itemMenu,
        })
    }),
}

module.exports = itemMenuController