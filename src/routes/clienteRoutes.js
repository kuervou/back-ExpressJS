const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const validate = require('../middleware/validate')
const {
    clienteSchema,
    updateClienteSchema,
} = require('./validations/clienteValidation')
const auth = require('../middleware/auth')

router.post(
    '/clientes',
    auth,
    validate(clienteSchema),
    clienteController.crearCliente
)
router.get('/clientes', auth, clienteController.getClientes)
router.get('/clientes/:id', auth, clienteController.getClienteById)
router.put(
    '/clientes/:id',
    [auth, validate(updateClienteSchema)],
    clienteController.updateCliente
)
router.delete('/clientes/:id', auth, clienteController.deleteCliente)

module.exports = router
