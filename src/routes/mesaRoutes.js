const express = require('express')
const router = express.Router()
const mesaController = require('../controllers/mesaController')
const validate = require('../middleware/validate')
const { updateMesaSchema, mesaSchema } = require('./validations/mesaValidation')
const auth = require('../middleware/auth')

router.post('/mesas', [auth(['Admin']), validate(mesaSchema)], mesaController.crearMesa)
router.get('/mesas', auth(['Admin', 'Mozo']), mesaController.getMesas)
router.get('/mesas/:id', auth(['Admin', 'Mozo']), mesaController.getMesaById)
router.put(
    '/mesas/:id',
    [auth(['Admin', 'Mozo']), validate(updateMesaSchema)],
    mesaController.updateMesa
)
router.delete('/mesas/:id', auth(['Admin']), mesaController.deleteMesa)

module.exports = router
