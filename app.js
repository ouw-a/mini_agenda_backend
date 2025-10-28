const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const contactRouter = require('./controllers/contacts');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const sequelize = require('./db');

// Importa los modelos para que Sequelize los registre antes de sync
require('./models/contact');
require('./models/note');
sequelize.sync()
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/contacts', contactRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión perfecta a PostgreSQL');
    return sequelize.sync({ alter: true }); // <-- cambiar aquí
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor escuchando en puerto 3003');
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a PostgreSQL:', error);
  });

// Agrega la columna role con valor por defecto 'user'
sequelize.query(`
  ALTER TABLE contacts
  ADD COLUMN role VARCHAR(255) DEFAULT 'user' NOT NULL;
`)
  .then(() => {
    console.log('Columna "role" agregada a la tabla "contacts"');
  })
  .catch((error) => {
    console.error('Error al agregar la columna "role" a la tabla "contacts":', error);
  });

module.exports = app;
