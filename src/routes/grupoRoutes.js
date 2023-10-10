const express = require('express')
const router = express.Router()
const grupoController = require('../controllers/grupoController')
const validate = require('../middleware/validate')
const { grupoSchema } = require('./validations/grupoValidation')
const auth = require('../middleware/auth')

router.post(
    '/grupos',
    [auth(['Admin']), validate(grupoSchema)],
    grupoController.crearGrupo
)
router.get('/grupos', auth, grupoController.getGrupos)
router.get('/grupos/:id', auth, grupoController.getGrupoById)
router.put(
    '/grupos/:id',
    [auth(['Admin']), validate(grupoSchema)],
    grupoController.updateGrupo
)
router.delete('/grupos/:id', auth(['Admin']), grupoController.deleteGrupo)

module.exports = router
