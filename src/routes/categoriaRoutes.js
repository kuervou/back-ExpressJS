const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const validate = require('../middleware/validate')
const { categoriaSchema } = require('./validations/categoriaValidation')
const auth = require('../middleware/auth')

router.post(
    '/categorias',
    [auth(['Admin']), validate(categoriaSchema)],
    categoriaController.crearCategoria
)
router.get('/categorias', auth(['Admin']), categoriaController.getCategorias)
router.get(
    '/categorias/:id',
    auth(['Admin']),
    categoriaController.getCategoriaById
)
router.put(
    '/categorias/:id',
    [auth(['Admin']), validate(categoriaSchema)],
    categoriaController.updateCategoria
)
router.delete(
    '/categorias/:id',
    auth(['Admin']),
    categoriaController.deleteCategoria
)

module.exports = router
