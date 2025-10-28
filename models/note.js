const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Note extends Model {}

Note.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Note',
  tableName: 'notes',
  timestamps: false
});

module.exports = Note;