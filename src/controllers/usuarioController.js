const usuarioService = require('../services/usuarioService');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const usuarioController = {
  crearUsuario: async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Campos incompletos' });
    }
    try {
      await usuarioService.crearUsuario(username, email, password);
      res.status(201).json({ message: 'Usuario creado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  },
  login: async function(req, res) {
    const { username, password } = req.body;
    const user = await usuarioService.authenticate(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      SECRET_KEY,
      {
        expiresIn: '1h' // El token expira en 1 hora
      }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  },
};

module.exports = usuarioController;
