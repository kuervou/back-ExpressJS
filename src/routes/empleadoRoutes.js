const express = require('express')
const router = express.Router()
const empleadoController = require('../controllers/empleadoController')
const validate = require('../middleware/validate')
const {
    empleadoSchema,
    updateEmpleadoSchema,
    loginSchema,
    resetPasswordSchema,
    querySchema,
} = require('./validations/empleadoValidation')
const auth = require('../middleware/auth')

//agregarle el auth luego
router.post(
    '/empleados',
    validate(empleadoSchema),
    empleadoController.crearEmpleado
)
router.post(
    '/login',
    validate(loginSchema),
    validate(querySchema, 'query'),
    empleadoController.login
)
router.get('/empleados', auth(['Admin']), empleadoController.getEmpleados)
router.get(
    '/empleados/:id',
    auth(['Admin']),
    empleadoController.getEmpleadoById
)
router.put(
    '/empleados/:id',
    [auth(['Admin']), validate(updateEmpleadoSchema)],
    empleadoController.updateEmpleado
)
router.delete(
    '/empleados/:id',
    auth(['Admin']),
    empleadoController.deleteEmpleado
)
router.patch(
    '/resetPassword/:id',
    auth([]),
    validate(resetPasswordSchema),
    empleadoController.resetPassword
)

module.exports = router
