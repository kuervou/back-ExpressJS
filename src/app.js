/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// Importar el objeto de base de datos
const db = require('./models')

// Importar rutas
const configureRoutes = require('./routes')

// Importar el manejador de Socket.io
const socketHandler = require('./webSocket/socketHandler')

// Instancia Socket.io
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

// Middleware
app.use(cors())
app.use(express.json())

// Middleware para adjuntar `io` al objeto `req`
app.use((req, res, next) => {
    req.io = io
    next()
})

// Configurar rutas
configureRoutes(app, io)

// Configurar Socket.io
socketHandler(io)

if (process.env.NODE_ENV !== 'TEST') {
    // Sincronizar con la base de datos y luego iniciar el servidor HTTP y Socket.io
    db.sequelize
        .sync()
        .then(() => {
            http.listen(port, () => {
                console.log(`Aplicación escuchando en http://localhost:${port}`)
            })
        })
        .catch((error) => {
            console.error(
                'Error al intentar conectar con la base de datos:',
                error
            )
        })
}

module.exports = { app, http, io, db }
