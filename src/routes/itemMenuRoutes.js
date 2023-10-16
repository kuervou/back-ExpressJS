// src/routes/itemMenuRoutes.js
const express = require('express')
const router = express.Router()
const itemMenuController = require('../controllers/itemMenuController')
const validate = require('../middleware/validate')
const {
    itemMenuSchema,
    updateItemMenuSchema,
    querySchema,
} = require('./validations/itemMenuValidations')
const auth = require('../middleware/auth')
const { ROLES } = require('../routes/roles/roles')

router.post(
    '/itemsMenu',
    [auth([ROLES.ADMIN]), validate(itemMenuSchema)],
    itemMenuController.crearItemMenu
)

router.get(
    '/itemsMenu',
    auth([ROLES.ADMIN]),
    validate(querySchema, 'query'),
    itemMenuController.getItemsMenu
)


//ruta para obtener los itemsMenu activos
router.get(
    '/itemsMenu/activos',
    validate(querySchema, 'query'),
    itemMenuController.getItemsMenuActivos
)

router.get(
    '/itemsMenu/:id',
    auth([ROLES.ADMIN]),
    itemMenuController.getItemMenuById
)

router.put(
    '/itemsMenu/:id',
    [auth([ROLES.ADMIN]), validate(updateItemMenuSchema)],
    itemMenuController.updateItemMenu
)

router.delete(
    '/itemsMenu/:id',
    auth([ROLES.ADMIN]),
    itemMenuController.deleteItemMenu
)

module.exports = router
