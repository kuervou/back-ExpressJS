// src/routes/botellaRoutes.js
const express = require('express')
const router = express.Router()
const logController = require('../controllers/logController')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')
const validate = require('../middleware/validate')
const {
    abrirBotellaSchema,
    cerrarBotellaSchema,
} = require('./validations/logValidations')

router.post(
    '/log/abrirBotella',
    auth([ROLES.ADMIN, ROLES.USER]),
    validate(abrirBotellaSchema),
    logController.abrirBotella
)
router.post(
    '/log/cerrarBotella',
    auth([ROLES.ADMIN, ROLES.USER]),
    validate(cerrarBotellaSchema),
    logController.cerrarBotella
)

module.exports = router
