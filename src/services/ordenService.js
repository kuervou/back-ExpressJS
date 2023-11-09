// src/services/ordenService.js
const ordenRepository = require('../repositories/ordenRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const empleadoRepository = require('../repositories/empleadoRepository')
const clienteRepository = require('../repositories/clienteRepository')
const itemRepository = require('../repositories/itemRepository')
const itemService = require('./itemService')
const pagoService = require('./pagoService')
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

const getRangoDelMes = (mes) => {
    const fechaActual = new Date()
    const mesActual = fechaActual.getMonth() + 1 // Enero es 0, Febrero es 1, y así sucesivamente
    const añoActual = fechaActual.getFullYear()

    let añoDelMes = mes > mesActual ? añoActual - 1 : añoActual
    const primerDiaDelMes = new Date(añoDelMes, mes - 1, 1)
    const ultimoDiaDelMes = new Date(añoDelMes, mes, 0) // El día 0 del siguiente mes es el último día del mes actual

    const primerDiaDelMesISO = primerDiaDelMes.toISOString().split('T')[0]
    const ultimoDiaDelMesISO = ultimoDiaDelMes.toISOString().split('T')[0]

    return {
        primerDia: primerDiaDelMesISO,
        ultimoDia: ultimoDiaDelMesISO,
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

    pagarTodo: async (data) => {
        const transaction = await sequelize.transaction()
        try {
            //creamos un objeto para guardar los pagos
            const pagos = []

            //Recorremos las ordenes no pagadas
            for (const orden of data.ordenesNoPagadas) {
                //Creamos un objeto pagoData con los datos necesarios para crear un pago
                const pagoData = {
                    fecha: data.fecha,
                    hora: data.hora,
                    metodoPago: data.metodoPago,
                    total: orden.total,
                    empleadoId: data.empleadoId,
                    cajaId: data.cajaId,
                    ordenId: orden.id,
                }

                //Creamos el pago
                const nuevoPago = await pagoService.crearPago(
                    pagoData,
                    transaction
                )

                //Agregamos el pago al array de pagos
                pagos.push(nuevoPago)
            }

            //Si todo está bien, confirmar la transacción
            await transaction.commit()

            return pagos
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },

    getOrdenes: async (options = {}) => {
        return await ordenRepository.findAll(options)
    },

    getOrdenById: async (id) => {
        return await ordenRepository.getOrdenById(id)
    },
    getOrdenesByIds: async (ids) => {
        return await ordenRepository.getOrdenesByIds(ids)
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

    getEstadisticasVentas: async (options = {}) => {
        //Vamos a manejar los filtros de fecha en el servicio, para no tener que hacerlo en el controller ni en el repository

        //Si envío el parametro día, debo devolver las estadisticas de ese día
        if (options.dia) {
            //Estamos seguros que de dia esta en formato ISO 8601 por la Joi validation
            return await ordenRepository.getEstadisticasVentasPorDia(
                options.dia
            )
        } else if (options.mes) {
            // Calculamos el rango del mes más reciente
            const { primerDia, ultimoDia } = getRangoDelMes(options.mes)

            options.fechaInicio = primerDia
            options.fechaFin = ultimoDia

            return await ordenRepository.getEstadisticasVentas(options)
        } else if (options.anio) {
            //Si envia el parametro año, caluclamos el primer dia del año y el ultimo dia del año
            const primerDiaDelAño = new Date(options.anio, 0, 1)
            const primerDiaDelAñoISO = primerDiaDelAño
                .toISOString()
                .split('T')[0]

            const ultimoDiaDelAño = new Date(options.anio, 11, 31)
            const ultimoDiaDelAñoISO = ultimoDiaDelAño
                .toISOString()
                .split('T')[0]

            options.fechaInicio = primerDiaDelAñoISO
            options.fechaFin = ultimoDiaDelAñoISO

            return await ordenRepository.getEstadisticasVentas(options)
        }
    },

    getCantOrdenesProcesadas: async (options = {}) => {
        //Vamos a manejar los filtros de fecha en el servicio, para no tener que hacerlo en el controller ni en el repository

        //Si envío el parametro día, debo devolver las estadisticas de ese día
        if (options.dia) {
            //Estamos seguros que de dia esta en formato ISO 8601 por la Joi validation
            return await ordenRepository.getCantOrdenesProcesadasPorDia(
                options.dia
            )
        } else if (options.mes) {
            // Calculamos el rango del mes más reciente
            const { primerDia, ultimoDia } = getRangoDelMes(options.mes)

            options.fechaInicio = primerDia
            options.fechaFin = ultimoDia

            return await ordenRepository.getCantOrdenesProcesadas(options)
        } else if (options.anio) {
            //Si envia el parametro año, caluclamos el primer dia del año y el ultimo dia del año
            const primerDiaDelAño = new Date(options.anio, 0, 1)
            const primerDiaDelAñoISO = primerDiaDelAño
                .toISOString()
                .split('T')[0]

            const ultimoDiaDelAño = new Date(options.anio, 11, 31)
            const ultimoDiaDelAñoISO = ultimoDiaDelAño
                .toISOString()
                .split('T')[0]

            options.fechaInicio = primerDiaDelAñoISO
            options.fechaFin = ultimoDiaDelAñoISO

            return await ordenRepository.getCantOrdenesProcesadas(options)
        }
    },

    getConsumoPorClienteId: async (id, options = {}) => {
        //Vamos a manejar los filtros de fecha en el servicio, para no tener que hacerlo en el controller ni en el repository

        //Si envío el parametro día, debo devolver las estadisticas de ese día
        if (options.dia) {
            //Estamos seguros que de dia esta en formato ISO 8601 por la Joi validation
            return await ordenRepository.getConsumoPorClienteIdPorDia(
                id,
                options.dia
            )
        } else if (options.mes) {
            // Calculamos el rango del mes más reciente
            const { primerDia, ultimoDia } = getRangoDelMes(options.mes)

            options.fechaInicio = primerDia
            options.fechaFin = ultimoDia

            return await ordenRepository.getConsumoPorClienteId(id, options)
        } else if (options.anio) {
            //Si envia el parametro año, caluclamos el primer dia del año y el ultimo dia del año
            const primerDiaDelAño = new Date(options.anio, 0, 1)
            const primerDiaDelAñoISO = primerDiaDelAño
                .toISOString()
                .split('T')[0]

            const ultimoDiaDelAño = new Date(options.anio, 11, 31)
            const ultimoDiaDelAñoISO = ultimoDiaDelAño
                .toISOString()
                .split('T')[0]

            options.fechaInicio = primerDiaDelAñoISO
            options.fechaFin = ultimoDiaDelAñoISO

            return await ordenRepository.getConsumoPorClienteId(id, options)
        }
    },

    getConsumoClientes: async (options = {}) => {
        //Vamos a manejar los filtros de fecha en el servicio, para no tener que hacerlo en el controller ni en el repository

        //Si envío el parametro día, debo devolver las estadisticas de ese día
        if (options.dia) {
            //Estamos seguros que de dia esta en formato ISO 8601 por la Joi validation
            return await ordenRepository.getConsumoClientesPorDia(options.dia)
        } else if (options.mes) {
            // Calculamos el rango del mes más reciente
            const { primerDia, ultimoDia } = getRangoDelMes(options.mes)

            options.fechaInicio = primerDia
            options.fechaFin = ultimoDia

            return await ordenRepository.getConsumoClientes(options)
        } else if (options.anio) {
            //Si envia el parametro año, caluclamos el primer dia del año y el ultimo dia del año
            const primerDiaDelAño = new Date(options.anio, 0, 1)
            const primerDiaDelAñoISO = primerDiaDelAño
                .toISOString()
                .split('T')[0]

            const ultimoDiaDelAño = new Date(options.anio, 11, 31)
            const ultimoDiaDelAñoISO = ultimoDiaDelAño
                .toISOString()
                .split('T')[0]

            options.fechaInicio = primerDiaDelAñoISO
            options.fechaFin = ultimoDiaDelAñoISO

            return await ordenRepository.getConsumoClientes(options)
        }
    },

    getHorasPico: async (options = {}) => {
        return await ordenRepository.getHorasPico(options)
    },

    getIngresoEnMes: async (options = {}) => {
        const { mes } = options
        const { primerDia, ultimoDia } = getRangoDelMes(mes)

        options.fechaInicio = primerDia
        options.fechaFin = ultimoDia

        return await ordenRepository.getIngresoEnMes(options)
    },

    getIngresoEnAnio: async (options = {}) => {
        //Si envia el parametro año, caluclamos el primer dia del año y el ultimo dia del año
        const primerDiaDelAño = new Date(options.anio, 0, 1)
        const primerDiaDelAñoISO = primerDiaDelAño.toISOString().split('T')[0]

        const ultimoDiaDelAño = new Date(options.anio, 11, 31)
        const ultimoDiaDelAñoISO = ultimoDiaDelAño.toISOString().split('T')[0]

        options.fechaInicio = primerDiaDelAñoISO
        options.fechaFin = ultimoDiaDelAñoISO

        return await ordenRepository.getIngresoEnAnio(options)
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

            if (data.estado) {
                //Obtenemos la informacion de la orden que se quiere actualizar
                const orden = await ordenRepository.getOrdenById(orderId)

                //Si el estado de la orden es POR_CONFIRMAR y se desea actualizar a EN_COCINA o ENTREGADA
                if (
                    orden.estado === ESTADOS.POR_CONFIRMAR &&
                    (data.estado === ESTADOS.EN_COCINA ||
                        data.estado === ESTADOS.ENTREGADA)
                ) {
                    //Si la orden tiene mesas debemos marcarlas como ocupadas
                    if (orden.mesas) {
                        //usamos el handleMesas de ordenRepository para marcar las mesas como ocupadas
                        await ordenRepository.handleMesas(orden, orden, t)
                    }
                }
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

            //debemos vereificar que la orden no quede sin items luego de eliminar los items
            const itemsOrden = await itemRepository.findAll({
                ordenId: orderId,
            })

            if (itemsOrden.length - items.length === 0) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'No se puede eliminar todos los items de la orden'
                )
            }

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

            //si la orden tiene mesas, debemos desvincularlas
            if (orden.mesas) {
                await ordenRepository.desvincularMesas(id, orden.mesas, t)
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
