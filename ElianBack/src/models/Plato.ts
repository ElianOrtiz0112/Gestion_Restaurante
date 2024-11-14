import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Plato extends Model {
    public id!: number;
    public nombre!: string;
    public precio!: number;
}

// Definición del modelo
Plato.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'platos',
});

export default Plato;
