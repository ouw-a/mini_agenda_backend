const Sequelize = require('./db');
const usuario = require('./models/usuario');
const Cuenta = require('./models/Cuenta');

(async () => {
    try {
        await sequelize.sync({ force: true });

        const ana = await usuario.create({ nombre: 'Ana', apellido: 'García', edad: 28 });  
        await Cuenta.create({ saldo: 1000, usuarioId: ana.id });
        await Cuenta.create({ saldo: 500, usuarioId: ana.id });

        const usuarios = await usuario.findAll({ include: Cuenta });

        usuarios.forEach(u => {
            const total = u.Cuentas.reduce((sum, c) => sum + parseFloat(c.saldo), 0);
            console.log(`${u.nombre} tiene $$(total)`);
        });