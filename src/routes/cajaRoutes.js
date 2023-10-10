const express = require('express')
const router = express.Router()
const cajaController = require('../controllers/cajaController')
const validate = require('../middleware/validate')
const { cajaSchema } = require('./validations/cajaValidation')
const auth = require('../middleware/auth')

router.post('/cajas', [auth(['Admin']), validate(cajaSchema)], cajaController.crearCaja)
router.get('/cajas', auth(['Admin']), cajaController.getCajas)
router.get('/cajas/:id', auth(['Admin']), cajaController.getCajaById)
router.put(
    '/cajas/:id',
    [auth(['Admin']), validate(cajaSchema)],
    cajaController.updateCaja
)
router.delete('/cajas/:id', auth(['Admin']), cajaController.deleteCaja)

module.exports = router
