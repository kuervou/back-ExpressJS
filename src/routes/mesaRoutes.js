const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const auth = require('../middleware/auth');

router.post('/mesa', mesaController.addMesa);
router.get('/mesas', auth, mesaController.getMesas);
router.put('/mesa/:id', mesaController.updateMesa);
router.delete('/mesa/:id', mesaController.deleteMesa);

module.exports = router;
