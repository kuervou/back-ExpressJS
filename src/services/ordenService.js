// src/services/ordenService.js
const ordenRepository = require('../repositories/ordenRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const empleadoRepository = require('../repositories/empleadoRepository')
const clienteRepository = require('../repositories/clienteRepository')
const itemRepository = require('../repositories/itemRepository')
const itemService = require('./itemService')
const { ESTADOS } = require('../constants/estados/estados')

const db = require('../models')
const pagoRepository = require('../repositories/pagoRepository')
const mesaRepository = require('../repositories/mesaRepository')
const sequelize = db.sequelize

//funcion checkEmpleadoExists
const checkEmpleadoExists = async (empleadoId) => {
    const existingEmpleado =
        await empleadoRepository.getEmpleadoById(empleadoId)
    if (!existingEmpleado) {
        throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
    }
}

//Funcion checkClienteExists
const checkClienteExists = async (clienteId) => {
    const existingCliente = await clienteRepository.getClienteById(clienteId)
    if (!existingCliente) {
        throw new HttpError(HttpCode.NOT_FOUND, 'Cliente no encontrado')
    }
}

const ordenService = {
    crearOrden: async (data) => {
        const t = await sequelize.transaction()
        try {
            if (data.empleadoId) {
                //validar que exista el empleado
                await checkEmpleadoExists(data.empleadoId)
            }

            //si envian un cliente, validar que exista
            if (data.clienteId) {
                await checkClienteExists(data.clienteId)
            }

            //debemos validar que las mesas existan
            if (data.mesas) {
                const existenMesas = await mesaRepository.checkMesas(data.mesas)
                if (!existenMesas) {
                    throw new HttpError(
                        HttpCode.BAD_REQUEST,
                        'Una o más mesas no existen'
                    )
                }
            }

            //debemos validar que los items no sean []
            if (!data.items || data.items.length === 0) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'Debe enviar al menos un item'
                )
            }

            //debemos validar que hayan enviado items y que cada item tenga un itemMenuId, cantidad y precio
            if (data.items) {
                data.items.forEach((item) => {
                    if (!item.itemMenuId || !item.cantidad || !item.precio) {
                        throw new HttpError(
                            HttpCode.BAD_REQUEST,
                            'Los items deben tener un itemMenuId, cantidad y precio'
                        )
                    }
                })
            }

            //calcular total recorriendo todos los items, y para cada uno de ellos multiplicar cantidad por precio, y sumarlos
            const total = data.items.reduce((acc, item) => {
                return acc + item.cantidad * item.precio
            }, 0)

            data.total = total
            if (!data.paga) {
                data.paga = false
            }

            //crear la nueva orden
            const newOrden = await ordenRepository.createOrden(data, t) // Solo crear la orden.
            if (data.mesas) {
                // Si hay mesas, actualizarlas.
                await ordenRepository.handleMesas(data, newOrden, t)
            }
            if (data.items) {
                // Si hay items, crearlos.
                await itemService.createItemsForOrder(data, newOrden, t)
            }

            await t.commit()
            return newOrden
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    getOrdenes: async (options = {}) => {
        return await ordenRepository.findAll(options)
    },

    getOrdenById: async (id) => {
        return await ordenRepository.getOrdenById(id)
    },

    getOrdenesCaja: async (options = {}) => {
        return await ordenRepository.findAllCaja(options)
    },

    getOrdenesMozo: async (options = {}) => {
        return await ordenRepository.findAllMozo(options)
    },

    getOrdenesHistorial: async (options = {}) => {
        return await ordenRepository.findAllHistorial(options)
    },

    getCountOcupacion: async () => {
        return await ordenRepository.countOcupacion()
    },

    getEstadoPagos: async (id) => {
        const orden = await ordenRepository.getOrdenById(id)
        if (!orden) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        const pagos = await pagoRepository.findAll({
            ordenId: id,
        })

        let totalPagado = 0

        pagos.items.forEach((pago) => {
            totalPagado += pago.total
        })

        const estadoPagos = {
            totalPagado,
            totalOrden: orden.total,
            paga: orden.paga,
            infoPagos: pagos.items,
        }

        return estadoPagos
    },

    updateOrden: async (orderId, data) => {
        const t = await sequelize.transaction()
        try {
            if (data.empleadoId) {
                await checkEmpleadoExists(data.empleadoId)
            }

            if (data.clienteId) {
                await checkClienteExists(data.clienteId)
            }

            const result = await ordenRepository.update(orderId, data, t)

            await t.commit()
            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    addMesas: async (orderId, mesas) => {
        const t = await sequelize.transaction()
        try {
            const orden = await ordenRepository.findById(orderId, t)
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            }

            const result = await ordenRepository.addMesas(orderId, mesas, t)
            await t.commit()
            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    removeMesas: async (orderId, mesas) => {
        const t = await sequelize.transaction()
        try {
            const orden = await ordenRepository.findById(orderId, t)
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            }

            const result = await ordenRepository.removeMesas(orderId, mesas, t)
            await t.commit()
            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    addItems: async (orderId, data) => {
        const t = await sequelize.transaction()
        try {
            const orden = await ordenRepository.findById(orderId, t)
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            }

            /* 
            DEJO ESTA LOGICA ACÁ POR SI ALGÚN DIA LOS CLIENTES QUISIERAN AGREGAR ESTA VALIDACIÓN
            // si el estado de la orden es distinto de "En cocina" o "Por confirmar" no se pueden añadir items
            if (orden.estado !== ESTADOS.EN_COCINA && orden.estado !== ESTADOS.POR_CONFIRMAR) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'No se pueden añadir items a esta orden');
            }
            */

            const result = await itemService.createItemsForOrder(data, orden, t)

            //debemos actualizar el total de la orden
            const totalItems = data.items.reduce((acc, item) => {
                return acc + item.cantidad * item.precio
            }, 0)

            //el total de la orden será el total actual + el total de los items
            const total = orden.total + totalItems

            await ordenRepository.update(orderId, { total }, t)

            await t.commit()
            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    removeItems: async (orderId, items) => {
        const t = await sequelize.transaction()
        try {
            const orden = await ordenRepository.findById(orderId, t)
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            }

            /*
                        DEJO ESTA LOGICA ACÁ POR SI ALGÚN DIA LOS CLIENTES QUISIERAN AGREGAR ESTA VALIDACIÓN

            // si el estado de la orden es distinto de "En cocina" o "Por confirmar" no se pueden eliminar items
            if (orden.estado !== ESTADOS.EN_COCINA && orden.estado !== ESTADOS.POR_CONFIRMAR) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'No se pueden eliminar items de esta orden');
            }

            */

            //Debemos verificar que los items que se quieren eliminar pertenezcan a la orden

            const existingItems = await itemRepository.findItems(items)

            //recorremos los items en existingItems y verificamos que todos pertenezcan a la orden
            existingItems.forEach((item) => {
                if (item.ordenId != orderId) {
                    throw new HttpError(
                        HttpCode.BAD_REQUEST,
                        'No se pueden eliminar items que no pertenezcan a la orden'
                    )
                }
            })

            const result = await itemService.deleteItems(items, t)

            await t.commit()

            //debemos actualizar el total de la orden y para eso usamos updateOrderTotal de itemRepository
            await itemRepository.updateOrderTotal(orderId)

            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    deleteOrden: async (id) => {
        const t = await sequelize.transaction()
        try {
            const orden = await ordenRepository.getOrdenById(id)
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            }

            //debemos verificar si esta orden tiene algun pago asociado, si es asi, no se puede eliminar
            const pagosOrden = await pagoRepository.findAll({
                ordenId: id,
            })
            if (pagosOrden.total > 0) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'No se puede eliminar una orden con pagos asociados'
                )
            }

            //verificamos el estado de la orden, solo se puede eliminar si está en estado "Por confirmar" o "En cocina"
            if (
                orden.estado !== ESTADOS.POR_CONFIRMAR &&
                orden.estado !== ESTADOS.EN_COCINA
            ) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'No se puede eliminar una orden con estado: ' + orden.estado
                )
            }

            //si la orden tiene items, debemos eliminarlos
            if (orden.items) {
                await itemService.deleteItems(orden.items, t)
            }

            const result = await ordenRepository.deleteOrden(id, t)

            await t.commit()

            return result
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },
}

module.exports = ordenService
