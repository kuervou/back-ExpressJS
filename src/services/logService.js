const logRepository = require('../repositories/logRepository')
const empleadoLogRepository = require('../repositories/empleadoLogRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const db = require('../models')
const sequelize = db.sequelize

const logService = {
    abrirBotella: async (itemInventarioId, empleadoId) => {
        const transaction = await sequelize.transaction()

        //primero validamos que el itemInventarioId exista
        const itemInventario = await db.ItemInventario.findOne({
            where: {
                id: itemInventarioId,
            },
        })

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un item de inventario con el id especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //luego validamos que el empleadoId exista
        const empleado = await db.Empleado.findOne({
            where: {
                id: empleadoId,
            },
        })

        if (!empleado) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un empleado con el id especificado. ( EmpleadoId: ' +
                    empleadoId +
                    ' ))'
            )
        }

        //luego validamos que el itemInventario tenga su atributo "porUnidad" en false, si esta true o null no se puede abrir
        if (
            itemInventario.porUnidad === true ||
            itemInventario.porUnidad === null
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El item de inventario especificado no es de venta por trago. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //si ambos existen y se vende por tragos, primero debemos validar que no exista un log abierto para el itemInventarioId
        const openLog =
            await logRepository.findOpenLogByItemInventarioId(itemInventarioId)
        if (openLog) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Ya existe un registro de botella abierta para el item de inventario especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        try {
            // Crear el log
            const log = await logRepository.createLog(
                {
                    fechaHoraAbierta: new Date(),
                    itemInventarioId,
                },
                transaction
            )

            // Crear la relación en la tabla intermedia
            await empleadoLogRepository.createEmpleadoLog(
                {
                    empleadoId,
                    logId: log.id,
                },
                transaction
            )

            await transaction.commit()
            return log
        } catch (error) {
            await transaction.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    cerrarBotella: async (itemInventarioId, empleadoId) => {
        const transaction = await sequelize.transaction()

        //primero validamos que el itemInventarioId exista
        const itemInventario = await db.ItemInventario.findOne({
            where: {
                id: itemInventarioId,
            },
        })

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un item de inventario con el id especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //luego validamos que el empleadoId exista
        const empleado = await db.Empleado.findOne({
            where: {
                id: empleadoId,
            },
        })

        if (!empleado) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un empleado con el id especificado. ( EmpleadoId: ' +
                    empleadoId +
                    ' ))'
            )
        }

        //luego validamos que el itemInventario tenga su atributo "porUnidad" en false, si esta true o null no se puede cerrar
        if (
            itemInventario.porUnidad === true ||
            itemInventario.porUnidad === null
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El item de inventario especificado no es de venta por trago. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //si ambos existen y se vende por tragos, primero debemos validar que exista un log abierto para el itemInventarioId
        const openLog =
            await logRepository.findOpenLogByItemInventarioId(itemInventarioId)

        if (!openLog) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un registro de botella abierta para cerrar, para el item de inventario especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        try {
            // Cerrar el log
            const closedLog = await logRepository.closeLog(
                openLog.id,
                new Date(),
                transaction
            )

            // Crear o actualizar la relación en la tabla intermedia si es necesario
            await empleadoLogRepository.createEmpleadoLog(
                {
                    empleadoId,
                    logId: openLog.id,
                },
                transaction
            )

            await transaction.commit()
            return closedLog
        } catch (error) {
            await transaction.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },
}

module.exports = logService
