const mesaRoutes = require('./mesaRoutes')
const empleadoRoutes = require('./empleadoRoutes')
const clienteRoutes = require('./clienteRoutes')
const categoriaRoutes = require('./categoriaRoutes')
const grupoRoutes = require('./grupoRoutes')
module.exports = (app) => {
    app.use('/api', mesaRoutes)
    app.use('/api', empleadoRoutes)
    app.use('/api', clienteRoutes)
    app.use('/api', categoriaRoutes)
    app.use('/api', grupoRoutes)
}
