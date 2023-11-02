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
    removeItemsSchema,
} = require('./validations/ordenValidations')
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

router.get('/ordenes/caja', auth([ROLES.ADMIN]), ordenController.getOrdenesCaja)

router.get(
    '/ordenes/mozo',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    ordenController.getOrdenesMozo
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
