//src/routes/ordenRoutes.js

const express = require('express')
const router = express.Router()
const ordenController = require('../controllers/ordenController')
const validate = require('../middleware/validate')
const {
    updateOrdenSchema,
    ordenSchema,
    querySchema,
    addOrRemoveMesaSchema,
    addItemsSchema,
    porMesaSchema,
    removeItemsSchema,
} = require('./validations/ordenValidations')
const { statsSchema } = require('./validations/estadisticaValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post('/ordenes', validate(ordenSchema), ordenController.crearOrden)

router.get(
    '/ordenes',
    auth([ROLES.ADMIN, ROLES.MOZO, ROLES.COCINA]),
    validate(querySchema, 'query'),
    ordenController.getOrdenes
)

router.get(
    '/ordenes/ocupacion',
    auth([ROLES.ADMIN]),
    ordenController.getCountOcupacion
)

router.get(
    '/ordenes/caja',
    auth([ROLES.ADMIN]),
    validate(porMesaSchema, 'query'),
    ordenController.getOrdenesCaja
)

router.get(
    '/ordenes/mozo',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(porMesaSchema, 'query'),
    ordenController.getOrdenesMozo
)

router.get(
    '/ordenes/historial',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(porMesaSchema, 'query'),
    ordenController.getOrdenesHistorial
)

router.get(
    '/ordenes/:id',
    auth([ROLES.ADMIN, ROLES.MOZO, ROLES.COCINA]),
    ordenController.getOrdenById
)

router.put(
    '/ordenes/:id',
    auth([ROLES.ADMIN, ROLES.MOZO, ROLES.COCINA]),
    validate(updateOrdenSchema),
    ordenController.updateOrden
)

//rutas para add y remove mesas
router.post(
    '/ordenes/:id/mesas',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(addOrRemoveMesaSchema),
    ordenController.addMesas
)

router.delete(
    '/ordenes/:id/mesas',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(addOrRemoveMesaSchema),
    ordenController.removeMesas
)

//endpoint que dado un id de orden devuelve información de su pago
router.get(
    '/ordenes/:id/estadoPagos',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    ordenController.getEstadoPagos
)

//Estadísticas de ventas
router.get(
    '/ordenes/estadisticas/ventas',
    auth([ROLES.ADMIN]),
    validate(statsSchema, 'query'),
    ordenController.getEstadisticasVentas
)

//Estadísticas de cantidad de ordenes
router.get(
    '/ordenes/estadisticas/cantOrdenesProcesadas',
    auth([ROLES.ADMIN]),
    validate(statsSchema, 'query'),
    ordenController.getCantOrdenesProcesadas
)

//Estadísticas de consumo por cliente id
router.get(
    '/ordenes/estadisticas/consumoPorClienteId/:id',
    auth([ROLES.ADMIN]),
    validate(statsSchema, 'query'),
    ordenController.getConsumoPorClienteId
)

//Estadísticas de consumo de todos los clientes
router.get(
    '/ordenes/estadisticas/consumoClientes',
    auth([ROLES.ADMIN]),
    validate(statsSchema, 'query'),
    ordenController.getConsumoClientes
)

//rutas para add y remove items
router.post(
    '/ordenes/:id/items',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(addItemsSchema),
    ordenController.addItems
)

router.delete(
    '/ordenes/:id/items',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(removeItemsSchema),
    ordenController.removeItems
)

module.exports = router
