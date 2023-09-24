const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')
const auth = require('../middleware/auth')
const Joi = require('joi')
const validate = require('../middleware/validate')

// Definir el esquema de validación
const usuarioSchema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(), // CAMBIAR POR UNA MAS SEGURA
})

router.post('/usuario', validate(usuarioSchema), usuarioController.crearUsuario)
router.post('/login', usuarioController.login)

module.exports = router
