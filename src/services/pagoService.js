// src/services/pagoService.js

const pagoRepository = require('../repositories/pagoRepository')
const ordenRepository = require('../repositories/ordenRepository')
const empleadoRepository = require('../repositories/empleadoRepository')
const cajaRepository = require('../repositories/cajaRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const { METODOSPAGO } = require('../constants/metodosPago/metodosPago')

const db = require('../models')
const sequelize = db.sequelize

const pagoService = {
    crearPago: async (pagoData) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction()
        let ordenPagada = false;

        try {
            // Validar que la orden, el empleado y la caja existen
            const orden = await ordenRepository.getOrdenById(pagoData.ordenId)
            const empleado = await empleadoRepository.getEmpleadoById(
                pagoData.empleadoId
            )
            const caja = await cajaRepository.getCajaById(pagoData.cajaId)

            if (!orden) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Orden no encontrada')
            }

            if (!empleado) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'Empleado no encontrado'
                )
            }

            if (!caja) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Caja no encontrada')
            }

            // Si el método de pago es "Efectivo", se suma el total del pago al total de la caja
            if (pagoData.metodoPago === METODOSPAGO.EFECTIVO) {
                let nuevoTotalCaja = caja.total + pagoData.total
                await cajaRepository.updateTotal(
                    caja.id,
                    nuevoTotalCaja,
                    transaction
                )
            }

            //Debemos comprobar que estamos haciendo un pago a una orden que no ha sido pagada
            if (orden.paga) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'La orden ya ha sido pagada'
                )
            }

            //Debemos comprobar que el total del pago no sea mayor al total de la orden
            if (pagoData.total > orden.total) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El total del pago no puede ser mayor al total de la orden'
                )
            }

            //Obtenemos los pagos que ya tiene la orden
            const pagosOrden = await pagoRepository.findAll({
                ordenId: orden.id,
            })

            //Sumamos los pagos que ya tiene la orden
            let totalPagos = 0
            pagosOrden.items.forEach((pago) => {
                totalPagos += pago.total
            })

            //Sumamos el total del pago que se quiere hacer
            totalPagos += pagoData.total

            //Si el total de los pagos es mayor al total de la orden, no se puede hacer el pago
            if (totalPagos > orden.total) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'El pago actual sumado a los demas pagos parciales es mayor al total de la orden'
                )
            }

            //Si el total de los pagos es igual al total de la orden, se marca la orden como pagada
            if (totalPagos === orden.total) {
                await ordenRepository.updatePaga(orden.id, true, transaction)
                ordenPagada = true;
            }

            // Crear el pago
            const nuevoPago = await pagoRepository.create(pagoData, transaction)

            // Si todo está bien, confirmar la transacción
            await transaction.commit()

            return { nuevoPago, ordenPagada };

        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },

    getPagos: async function (options = {}) {
        return await pagoRepository.findAll(options)
    },

    getPagoById: async (id) => {
        const pago = await pagoRepository.findById(id)
        if (!pago) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Pago no encontrado')
        }
        return pago
    },

    deletePago: async (id) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction()
        let ordenEstabaPagada = false;
        try {
            // Obtener el pago
            const pago = await pagoRepository.findById(id)

            if (!pago) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Pago no encontrado')
            }

            // Solo proceder con la actualización de la caja si el método de pago es "Efectivo"
            if (pago.metodoPago === METODOSPAGO.EFECTIVO) {
                // Obtener la caja
                const caja = await cajaRepository.getCajaById(pago.cajaId)

                if (!caja) {
                    throw new HttpError(
                        HttpCode.BAD_REQUEST,
                        'Caja no encontrada'
                    )
                }

                // Como estamos eliminando un pago, debemos restar su total del total de la caja
                let nuevoTotalCaja = caja.total - pago.total
                await cajaRepository.updateTotal(
                    caja.id,
                    nuevoTotalCaja,
                    transaction
                )
            }

            //Obtenemos la orden
            const orden = await ordenRepository.getOrdenById(pago.ordenId)

            //Si la orden ya ha sido pagada, debemos marcarla como no pagada
            if (orden.paga) {
                await ordenRepository.updatePaga(orden.id, false, transaction)
                ordenEstabaPagada = true;
            }

            // Eliminar el pago
            const resultado = await pagoRepository.deletePago(id, transaction)

            // Si todo está bien, confirmar la transacción
            await transaction.commit()

            return { resultado, ordenEstabaPagada }
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },
}

module.exports = pagoService
