const mesaRoutes = require('./mesaRoutes')
const usuarioRoutes = require('./usuarioRoutes')

module.exports = (app) => {
    app.use('/api', mesaRoutes)
    app.use('/api', usuarioRoutes)
}
