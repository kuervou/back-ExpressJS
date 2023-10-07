const grupoRepository = require('../repositories/grupoRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')


//Función auxiliar para chequear unicidad del nombre 
const checkNombreUnique = async (nombre, excludeId = null) => {
    const formattedNombre = nombre.toLowerCase();
    const existingGrupo = await grupoRepository.findByNombre(formattedNombre);
    if (existingGrupo && (!excludeId || existingGrupo.id !== excludeId)) {
        throw new HttpError(HttpCode.CONFLICT, 'Ya existe un grupo con ese nombre');
    }
};

const grupoService = {
    crearGrupo: async (nombre) => {
        await checkNombreUnique(nombre);
        return await grupoRepository.create(nombre)
    },
    getGrupos: async function () {
        return await grupoRepository.findAll()
    },

    getGrupoById: async (id) => {
        return await grupoRepository.getGrupoById(id)
    },

    updateGrupo: async (id, nombre) => {
        await checkNombreUnique(nombre, id);
        return await grupoRepository.update(id, nombre)
    },
    deleteGrupo: async (id) => {
        return await grupoRepository.deleteGrupo(id)
    },
}

module.exports = grupoService
