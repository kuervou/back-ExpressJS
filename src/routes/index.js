const mesaRoutes = require('./mesaRoutes')
const empleadoRoutes = require('./empleadoRoutes')

module.exports = (app) => {
    app.use('/api', mesaRoutes)
    app.use('/api', empleadoRoutes)
}
