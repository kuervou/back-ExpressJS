const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const validate = require('../middleware/validate');
const { empleadoSchema, loginSchema } = require('./validations/empleadoValidation');

router.post('/empleado', validate(empleadoSchema), empleadoController.crearEmpleado);
router.post('/login', validate(loginSchema), empleadoController.login);

module.exports = router;
