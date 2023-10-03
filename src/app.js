/* eslint-disable no-console */

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000 //process.env.PORT

// Imports
const db = require('./models')
const configureRoutes = require('./routes')
const socketHandler = require('./webSocket/socketHandler')
const errorHandler = require('./error-handling/errorHandler')

// Instancia Socket.io
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

// Middleware para cors y parseo de req
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

app.use(errorHandler)

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
