import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Gestor_Restaurant', 'root', '12345678', {
    host: 'localhost',
    dialect: 'mysql',
});

export { sequelize };
