const Sequelize = require('sequelize');

const sequelize = new Sequelize('lectura_infinita', 'postgres', '12345', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;