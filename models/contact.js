const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Contact extends Model {}

Contact.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'contacts',
  timestamps: false
});

// Ocultar contraseña en JSON de salida
Contact.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.contraseña;
  return values;
};

module.exports = Contact;
