const mesaRoutes = require('./mesaRoutes')
const empleadoRoutes = require('./empleadoRoutes')
const clienteRoutes = require('./clienteRoutes')
const categoriaRoutes = require('./categoriaRoutes')
const cajaRoutes = require('./cajaRoutes')
const grupoRoutes = require('./grupoRoutes')
const itemInventarioRoutes = require('./itemInventarioRoutes')
module.exports = (app) => {
    app.use('/api', mesaRoutes)
    app.use('/api', empleadoRoutes)
    app.use('/api', clienteRoutes)
    app.use('/api', categoriaRoutes)
    app.use('/api', cajaRoutes)
    app.use('/api', grupoRoutes)
    app.use('/api', itemInventarioRoutes)
}
