const express = require('express')
const router = express.Router()
const empleadoController = require('../controllers/empleadoController')
const validate = require('../middleware/validate')
const {
    empleadoSchema,
    updateEmpleadoSchema,
    loginSchema,
} = require('./validations/empleadoValidation')
const auth = require('../middleware/auth')

router.post(
    '/empleados',
    validate(empleadoSchema),
    empleadoController.crearEmpleado
) //agregarle el auth luego
router.post('/login', validate(loginSchema), empleadoController.login)
router.get('/empleados', auth(['Admin']), empleadoController.getEmpleados)
router.get('/empleados/:id', auth(['Admin']), empleadoController.getEmpleadoById)
router.put(
    '/empleados/:id',
    [auth(['Admin']), validate(updateEmpleadoSchema)],
    empleadoController.updateEmpleado
)
router.delete('/empleados/:id', auth(['Admin']), empleadoController.deleteEmpleado)

module.exports = router
