// src/controllers/pagoController.js

const pagoService = require('../services/pagoService')
const asyncHandler = require('express-async-handler')
const { HttpCode } = require('../error-handling/http_error')

const pagoController = {
    crearPago: asyncHandler(async (req, res) => {
        const pagoData = req.body
        await pagoService.crearPago(pagoData)
        res.status(HttpCode.CREATED).json({ message: 'Pago creado' })
    }),

    getPagos: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const fecha = req.query.fecha || ''
        const ordenId = req.query.ordenId || ''

        const pagos = await pagoService.getPagos({
            page,
            limit,
            fecha,
            ordenId,
        })
        res.json(pagos)
    }),

    getPagoById: asyncHandler(async (req, res) => {
        const id = req.params.id
        const pago = await pagoService.getPagoById(id)
        res.status(HttpCode.OK).json(pago)
    }),

    deletePago: asyncHandler(async (req, res) => {
        const id = req.params.id
        await pagoService.deletePago(id)
        res.status(HttpCode.OK).json({ message: 'Pago eliminado' })
    }),
}

module.exports = pagoController
