/*const mesaService = require('../services/mesaService.js')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const mesaController = {
    addMesa: asyncHandler(async (req, res) => {
        const numeroDeMesa = req.body.numeroDeMesa || req.body.numero_de_mesa
        const estaLibre = req.body.estaLibre || req.body.esta_libre

        if (numeroDeMesa === undefined || estaLibre === undefined) {
            throw new HttpError(HttpCode.BAD_REQUEST, 'Campos faltantes')
        }

        await mesaService.addMesa(numeroDeMesa, estaLibre)
        res.status(HttpCode.CREATED).json({ message: 'Mesa añadida' })
    }),

    getMesas: asyncHandler(async (req, res) => {
        const mesas = await mesaService.getMesas()
        res.json(mesas)
    }),

    updateMesa: asyncHandler(async (req, res) => {
        const { id } = req.params
        const numeroDeMesa = req.body.numeroDeMesa
        const estaLibre = req.body.estaLibre
        const io = req.io

        if (numeroDeMesa === undefined || estaLibre === undefined) {
            throw new HttpError(HttpCode.BAD_REQUEST, 'Campos faltantes')
        }

        const result = await mesaService.updateMesa(id, numeroDeMesa, estaLibre)

        if (result.affectedRows === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Mesa no encontrada')
        }

        io.emit('mesaUpdate', { numeroDeMesa, estaLibre })
        res.status(HttpCode.OK).json({ message: 'Mesa actualizada' })
    }),

    deleteMesa: asyncHandler(async (req, res) => {
        const { id } = req.params
        await mesaService.deleteMesa(id)
        res.status(HttpCode.OK).json({ message: 'Mesa eliminada' })
    }),
}

module.exports = mesaController
*/