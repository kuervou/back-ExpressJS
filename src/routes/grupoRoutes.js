const express = require('express')
const router = express.Router()
const grupoController = require('../controllers/grupoController')
const validate = require('../middleware/validate')
const { querySchema, grupoSchema } = require('./validations/grupoValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/grupos',
    [auth([ROLES.ADMIN]), validate(grupoSchema)],
    grupoController.crearGrupo
)
router.get(
    '/grupos',
    auth([]),
    validate(querySchema, 'query'),
    grupoController.getGrupos
)
router.get('/grupos/:id', auth([]), grupoController.getGrupoById)
router.put(
    '/grupos/:id',
    [auth([ROLES.ADMIN]), validate(grupoSchema)],
    grupoController.updateGrupo
)
router.delete('/grupos/:id', auth([ROLES.ADMIN]), grupoController.deleteGrupo)

module.exports = router
