const { Usuario } = require('../models'); // Importa el modelo del usuario
const bcrypt = require('bcryptjs'); 


const usuarioService = {
  crearUsuario: async (username, email, password) => {
    try {
      const nuevoUsuario = await Usuario.create({
        username,
        email,
        password 
      });
      return nuevoUsuario;
    } catch (error) {
      throw new Error('Error al crear el usuario');
    }
  },
  authenticate: async function(username, password) {
    const user = await Usuario.findOne({ where: { username }});
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
};

module.exports = usuarioService;
