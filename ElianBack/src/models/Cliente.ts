import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Cliente extends Model {
    public id!: number;
    public nombre!: string;
    public email!: string;
    public telefono!: string;
}

// Definición del modelo
Cliente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'clientes',
});

export default Cliente;
