// src/services/ordenService.js
const ordenRepository = require('../repositories/ordenRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const empleadoRepository = require('../repositories/empleadoRepository')
const clienteRepository = require('../repositories/clienteRepository')
const itemService = require('./itemService')

const db = require('../models')
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

    updateOrden: async (orderId, data) => {
        const t = await sequelize.transaction();
        try {
            if (data.empleadoId) {
                await checkEmpleadoExists(data.empleadoId);
            }
    
            if (data.clienteId) {
                await checkClienteExists(data.clienteId);
            }

            const result = await ordenRepository.update(orderId, data, t);

            await t.commit();
            return result;

        } catch (error) {
            await t.rollback();
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message);
        }
    },

    addMesas: async (orderId, mesas) => {
        const t = await sequelize.transaction();
        try {
            const orden = await ordenRepository.findById(orderId, t);
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada');
            }

            await ordenRepository.addMesas(orderId, mesas, t);
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message);
        }
    },

    removeMesas: async (orderId, mesas) => {
        const t = await sequelize.transaction();
        try {
            const orden = await ordenRepository.findById(orderId, t);
            if (!orden) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada');
            }

            await ordenRepository.removeMesas(orderId, mesas, t);
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message);
        }
    },
    


}

module.exports = ordenService
