// controllers/mesaController.js

const { db } = require('../../config/config.js'); // Importar la conexión a la base de datos
const mesaService = require('../services/mesaService.js');

const mesaController = {

    addMesa: async function(req, res) {
      const numeroDeMesa = req.body.numeroDeMesa || req.body.numero_de_mesa;
      const estaLibre = req.body.estaLibre || req.body.esta_libre;

      if (numeroDeMesa === undefined || estaLibre === undefined) {
        return res.status(400).json({ error: 'Campos faltantes' });
      }

      try {
        await mesaService.addMesa(numeroDeMesa, estaLibre);
        res.status(201).json({ message: 'Mesa añadida' });
      } catch (err) {
        res.status(500).json({ error: 'Error al añadir mesa' });
      }
    },
  
    getMesas: async function(req, res) {
      try {
        const mesas = await mesaService.getMesas();
        res.json(mesas);
      } catch (err) {
        res.status(500).json({ error: 'Error al obtener mesas' });
      }
    },
  
    updateMesa: async function(req, res) {
      const { id } = req.params;
      const numeroDeMesa = req.body.numeroDeMesa;
      const estaLibre = req.body.estaLibre;
      const io = req.io;
  
      if (numeroDeMesa === undefined || estaLibre === undefined) {
        return res.status(400).json({ error: 'Campos faltantes' });
      }
  
      try {
        const result = await mesaService.updateMesa(id, numeroDeMesa, estaLibre);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Mesa no encontrada' });
        }
        io.emit('mesaUpdate', { numeroDeMesa, estaLibre });
        res.status(200).json({ message: 'Mesa actualizada' });
      } catch (err) {
        res.status(500).json({ error: 'Error al actualizar mesa' });
      }
    },
  
    deleteMesa: async function(req, res) {
      const { id } = req.params;
      try {
        await mesaService.deleteMesa(id);
        res.send('Mesa eliminada');
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar mesa' });
      }
    },
  };
  module.exports = mesaController;
