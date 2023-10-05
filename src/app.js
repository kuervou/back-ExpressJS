/* eslint-disable no-console */

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000 //process.env.PORT
const { exec } = require('child_process');
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
    // Ejecutar migraciones (tampoco se deben ejecutar en prod)
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando migraciones:', error); 
            return;
        }
        console.log(stdout);

        // Iniciar el servidor después de ejecutar las migraciones
        http.listen(port, () => {
            console.log(`Aplicación escuchando en http://localhost:${port}`);
        });
    });
}

module.exports = { app, http, io, db }
