const express = require('express')
const router = express.Router()
const itemInventarioController = require('../controllers/itemInventarioController')
const validate = require('../middleware/validate')
const {
    itemInventarioSchema,
    updateItemInventarioSchema,
    querySchema,
} = require('./validations/itemInventarioValidation')
const auth = require('../middleware/auth')

router.post(
    '/itemsInventario',
    [auth(['Admin']), validate(itemInventarioSchema)],
    itemInventarioController.crearItemInventario
)
router.get(
    '/itemsInventario',
    auth(['Admin']),
    validate(querySchema, 'query'),
    itemInventarioController.getItemsInventario
)
router.get(
    '/itemsInventario/:id',
    auth(['Admin']),
    itemInventarioController.getItemInventarioById
)
router.put(
    '/itemsInventario/:id',
    [auth(['Admin']), validate(updateItemInventarioSchema)],
    itemInventarioController.updateItemInventario
)
router.delete(
    '/itemsInventario/:id',
    auth(['Admin']),
    itemInventarioController.deleteItemInventario
)

module.exports = router
