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
router.get('/empleados', auth, empleadoController.getEmpleados)
router.get('/empleados/:id', auth, empleadoController.getEmpleadoById)
router.put(
    '/empleados/:id',
    [auth, validate(updateEmpleadoSchema)],
    empleadoController.updateEmpleado
)
router.delete('/empleados/:id', auth, empleadoController.deleteEmpleado)

module.exports = router
