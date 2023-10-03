const empleadoRepository = require('../repositories/empleadoRepository')
const bcrypt = require('bcryptjs')

const empleadoService = {
    crearEmpleado: async ( nick, nombre, apellido, password, telefono, rol,activo) => {
        return await empleadoRepository.create( nick, nombre, apellido, password, telefono, rol,activo)
    },
    authenticate: async (username, password) => {
        const user = await empleadoRepository.findByNick(username)
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return user
    },
}

module.exports = empleadoService
