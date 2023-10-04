const mesaRoutes = require('./mesaRoutes')
const empleadoRoutes = require('./empleadoRoutes')
const clienteRoutes = require('./clienteRoutes')
module.exports = (app) => {
    app.use('/api', mesaRoutes)
    app.use('/api', empleadoRoutes)
    app.use('/api', clienteRoutes)
}
