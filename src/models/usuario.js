'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Aquí puedes definir las relaciones
    }
  }
  Usuario.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks: {
      beforeSave: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });
  return Usuario;
};
