// src/controllers/logController.js
const asyncHandler = require('express-async-handler')
const logService = require('../services/logService')

const logController = {
    abrirBotella: asyncHandler(async (req, res) => {
        const { itemInventarioId, empleadoId } = req.body
        const log = await logService.abrirBotella(itemInventarioId, empleadoId)
        res.status(201).json(log)
    }),

    cerrarBotella: asyncHandler(async (req, res) => {
        const { itemInventarioId, empleadoId } = req.body
        const log = await logService.cerrarBotella(itemInventarioId, empleadoId)
        //log es la cant de registros updeateados en funcion de esto retornamos si la botella se cerro o no
        if (log[0] === 0) {
            res.status(400).json({
                message:
                    'No se pudo cerrar la botella, probablemente no exista un registro de botella abierta para el item de inventario especificado.',
            })
        } else {
            res.status(200).json({
                message: 'La botella se cerró correctamente.',
            })
        }
    }),

    getLog: asyncHandler(async (req, res) => {
        const { itemInventarioId, empleadoId } = req.query
        const log = await logService.getLog(itemInventarioId, empleadoId)
        res.status(200).json(log)
    }),

}

module.exports = logController
