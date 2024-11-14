import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Orden extends Model {
    public id!: number;
    public clienteId!: number; // Relación con Cliente
    public fecha!: Date;
}

// Definición del modelo
Orden.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'ordenes',
});

export default Orden;
