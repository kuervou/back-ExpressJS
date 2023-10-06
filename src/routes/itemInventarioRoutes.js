const express = require('express')
const router = express.Router()
const itemInventarioController = require('../controllers/itemInventarioController')
const validate = require('../middleware/validate')
const { itemInventarioSchema, updateItemInventarioSchema } = require('./validations/itemInventarioValidation')
const auth = require('../middleware/auth')

router.post(
    '/itemsInventario',
    [auth, validate(itemInventarioSchema)],
    itemInventarioController.crearItemInventario
)
router.get('/itemsInventario', auth, itemInventarioController.getItemsInventario)
router.get('/itemsInventario/:id', auth, itemInventarioController.getItemInventarioById)
router.put(
    '/itemsInventario/:id',
    [auth, validate(updateItemInventarioSchema)],
    itemInventarioController.updateItemInventario
)
router.delete('/itemsInventario/:id', auth, itemInventarioController.deleteItemInventario)

module.exports = router
