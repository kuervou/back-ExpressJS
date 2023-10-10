/*
Aquí, el middleware se encarga de:

Leer el token del encabezado Authorization.
Verificar el token usando jwt.verify.
Comprobar si el rol del usuario está permitido
Adjuntar el resultado al objeto req si el token es válido.
Pasar el control al siguiente middleware en la cadena usando next().
*/
const jwt = require('jsonwebtoken')
const { HttpCode, HttpError } = require('../error-handling/http_error')

module.exports = function (allowedRoles = []) {
    return function (req, res, next) {
        const token = req.header('Authorization')
            ? req.header('Authorization').replace('Bearer ', '')
            : null;

        if (!token) {
            throw new HttpError(
                HttpCode.UNAUTHORIZED,
                'Acceso denegado. No hay token proporcionado.'
            )
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded;

            // Comprobar si el rol del usuario está permitido
            if (allowedRoles.length && !allowedRoles.includes(decoded.rol)) {
                throw new HttpError(
                    HttpCode.FORBIDDEN,
                    'Acceso denegado. No tienes permiso para realizar esta acción.'
                )
            }

            next();
        } catch (ex) {
            if (ex instanceof jwt.JsonWebTokenError) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Token inválido.');
            }
            throw ex;
        }
    }
}

