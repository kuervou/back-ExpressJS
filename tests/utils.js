const jwt = require('jsonwebtoken')

function generateTokenForTesting() {
    // Definimos un payload básico para las pruebas.
    // Esto debe ser similar al payload que usas en producción
    // al generar tokens para usuarios reales.
    const testUserPayload = {
        id: 1,
        role: 'admin', // o cualquier otro rol que sea relevante para tus pruebas
        // cualquier otro campo que incluyas en tus tokens JWT en producción
    }

    // Genera un token usando el payload y tu clave secreta.
    // Esto debería ser similar a cómo generas tokens en producción.
    const token = jwt.sign(testUserPayload, process.env.SECRET_KEY, {
        expiresIn: '1h', // puedes ajustar la duración si es necesario
    })

    return token
}
module.exports = { generateTokenForTesting }
