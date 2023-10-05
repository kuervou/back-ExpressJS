const empleadoRepository = require('../repositories/empleadoRepository')
const bcrypt = require('bcryptjs')

const empleadoService = {
    crearEmpleado: async ( nick, nombre, apellido, password, telefono, rol,activo) => {
        return await empleadoRepository.create( nick, nombre, apellido, password, telefono, rol,activo)
    },
    getEmpleados: async function () {
        return await empleadoRepository.findAll()
    },

    getEmpleadoById: async (id) => {
        return await empleadoRepository.getEmpleadoById(id);
    },
    

    updateEmpleado: async (id, nick, nombre, apellido, password, telefono, rol, activo) => {
        return await empleadoRepository.update(id, nick, nombre, apellido, password, telefono, rol, activo);
    },
    deleteEmpleado: async (id) => {
        return await empleadoRepository.deleteEmpleado(id);
    },
    
    
    authenticate: async (nick, password) => {
        const user = await empleadoRepository.findByNick(nick)
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return user
    },
}

module.exports = empleadoService
