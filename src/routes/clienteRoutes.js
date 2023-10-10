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
    auth(['Admin']),
    validate(clienteSchema),
    clienteController.crearCliente
)
router.get('/clientes', auth(['Admin']), clienteController.getClientes)
router.get('/clientes/:id', auth(['Admin']), clienteController.getClienteById)
router.put(
    '/clientes/:id',
    [auth(['Admin']), validate(updateClienteSchema)],
    clienteController.updateCliente
)
router.delete('/clientes/:id', auth(['Admin']), clienteController.deleteCliente)

module.exports = router
