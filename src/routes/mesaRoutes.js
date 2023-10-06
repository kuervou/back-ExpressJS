const express = require('express')
const router = express.Router()
const mesaController = require('../controllers/mesaController')
const validate = require('../middleware/validate')
const { updateMesaSchema, mesaSchema } = require('./validations/mesaValidation')
const auth = require('../middleware/auth')

router.post('/mesas', [auth, validate(mesaSchema)], mesaController.crearMesa)
router.get('/mesas', auth, mesaController.getMesas)
router.get('/mesas/:id', auth, mesaController.getMesaById)
router.put(
    '/mesas/:id',
    [auth, validate(updateMesaSchema)],
    mesaController.updateMesa
)
router.delete('/mesas/:id', auth, mesaController.deleteMesa)

module.exports = router
