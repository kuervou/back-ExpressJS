const express = require('express')
const router = express.Router()
const cajaController = require('../controllers/cajaController')
const validate = require('../middleware/validate')
const { cajaSchema } = require('./validations/cajaValidation')
const auth = require('../middleware/auth')

router.post('/cajas', [auth, validate(cajaSchema)], cajaController.crearCaja)
router.get('/cajas', auth, cajaController.getCajas)
router.get('/cajas/:id', auth, cajaController.getCajaById)
router.put(
    '/cajas/:id',
    [auth, validate(cajaSchema)],
    cajaController.updateCaja
)
router.delete('/cajas/:id', auth, cajaController.deleteCaja)

module.exports = router
