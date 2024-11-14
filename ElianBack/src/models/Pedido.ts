// src/models/Pedido.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Pedido extends Model {
    public id!: number;
    public fecha!: Date;
    public total!: number;
    public clienteId!: number; // Relación con Cliente
    public ordenId!: number; // Relación con Orden
    public platoId!: number; // Relación con Plato
}

// Definición del modelo
Pedido.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ordenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    platoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'pedidos',
});

export default Pedido;
