const empleadoService = require('../services/empleadoService')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const SECRET_KEY = process.env.SECRET_KEY

const empleadoController = {
    crearEmpleado: asyncHandler(async (req, res) => {
        const { nick, nombre, apellido, password, telefono, rol } = req.body
        await empleadoService.crearEmpleado(nick, nombre, apellido, password, telefono, rol)
        res.status(HttpCode.CREATED).json({ message: 'Empleado creado' })
    }),

    login: asyncHandler(async (req, res) => {
        const { nick, password } = req.body
        const empleado = await empleadoService.authenticate(nick, password)

        if (!empleado) {
            throw new HttpError(
                HttpCode.UNAUTHORIZED,
                'Usuario o contraseña incorrecta'
            )
        }

        const token = jwt.sign(
            {   id: empleado.id, 
                nick: empleado.nick, 
                nombre: empleado.nombre, 
                apellido: empleado.apellido, 
                telefono: empleado.telefono, 
                rol: empleado.rol, 
                activo: empleado.activo  },
            SECRET_KEY,
            { expiresIn: '1h' }
        )

        res.status(HttpCode.OK).json({
            token,
            empleado: {
                nick: empleado.nick, 
                nombre: empleado.nombre, 
                apellido: empleado.apellido, 
                telefono: empleado.telefono, 
                rol: empleado.rol, 
                activo: empleado.activo
            },
        })
    }),
}

module.exports = empleadoController
