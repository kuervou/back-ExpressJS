const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const validate = require('../middleware/validate')
const { categoriaSchema } = require('./validations/categoriaValidation')
const auth = require('../middleware/auth')

router.post(
    '/categorias',
    [auth, validate(categoriaSchema)],
    categoriaController.crearCategoria
)
router.get('/categorias', auth, categoriaController.getCategorias)
router.get('/categorias/:id', auth, categoriaController.getCategoriaById)
router.put(
    '/categorias/:id',
    [auth, validate(categoriaSchema)],
    categoriaController.updateCategoria
)
router.delete('/categorias/:id', auth, categoriaController.deleteCategoria)

module.exports = router
