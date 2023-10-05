const categoriaRepository = require('../repositories/categoriaRepository')


const categoriaService = {
    crearCategoria: async (nombre, apellido, telefono) => {
        return await categoriaRepository.create(nombre, apellido, telefono)
    },
    getCategorias: async function () {
        return await categoriaRepository.findAll()
    },

    getCategoriaById: async (id) => {
        return await categoriaRepository.getCategoriaById(id);
    },
    

    updateCategoria: async (id, nombre, apellido,  telefono, cuenta) => {
        return await categoriaRepository.update(id, nombre, apellido, telefono, cuenta);
    },
    deleteCategoria: async (id) => {
        return await categoriaRepository.deleteCategoria(id);
    },
    
    
}

module.exports = categoriaService
