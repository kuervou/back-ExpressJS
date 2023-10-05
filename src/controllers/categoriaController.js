const categoriaService = require('../services/categoriaService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const categoriaController = {
    crearCategoria: asyncHandler(async (req, res) => {
        const { nombre} = req.body
        await categoriaService.crearCategoria(nombre)
        res.status(HttpCode.CREATED).json({ message: 'Categoria creada' })
    }),

    getCategorias: asyncHandler(async (req, res) => {
        const categorias = await categoriaService.getCategorias()
        res.json(categorias)
    }),

    getCategoriaById: asyncHandler(async (req, res) => {
        const id = req.params.id;
        
        const categoria = await categoriaService.getCategoriaById(id);
        
        if (!categoria) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada');
        }
        
        res.status(HttpCode.OK).json(categoria);
    }),
    

    updateCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id;
        const {nombre } = req.body;
        
        const categoriaActualizada = await categoriaService.updateCategoria(id, nombre);
        
        if (categoriaActualizada[0] === 0) { // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada');
        }
        
        res.status(HttpCode.OK).json({ message: 'Categoria actualizada' });
    }),
    
    deleteCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id;
        
        const resultado = await categoriaService.deleteCategoria(id);
        
        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada');
        }
        
        res.status(HttpCode.OK).json({ message: 'Categoria eliminada' });
    }),
    


}

module.exports = categoriaController
