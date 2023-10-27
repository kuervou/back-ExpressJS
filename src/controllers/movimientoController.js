const movimientoService = require('../services/movimientoService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const movimientoController = {
    crearMovimiento: asyncHandler(async (req, res) => {
        const movimientoData = req.body
        await movimientoService.crearMovimiento(movimientoData)
        res.status(HttpCode.CREATED).json({ message: 'Movimiento creado' })
    }),

    getMovimientos: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterFecha = req.query.fecha || ''

        const movimientos = await movimientoService.getMovimientos({
            page,
            limit,
            fecha: filterFecha,
        })
        res.json(movimientos)
    }),

    getMovimientoById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const movimiento = await movimientoService.getMovimientoById(id)

        if (!movimiento) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Movimiento no encontrado')
        }

        res.status(HttpCode.OK).json(movimiento)
    }),

    deleteMovimiento: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await movimientoService.deleteMovimiento(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Movimiento no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Movimiento eliminado' })
    }),
}

module.exports = movimientoController