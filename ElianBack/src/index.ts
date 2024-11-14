import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { sequelize } from './config/database';
import ClienteRoutes from './routes/clienteRoutes';
import OrdenRoutes from './routes/ordenRoutes';
import PedidoRoutes from './routes/pedidoRoutes';
import PlatoRoutes from './routes/platoRoutes';
import authRoutes from './routes/authRoutes';
import './models/associations';

// Inicializa la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Configura el middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/clientes', ClienteRoutes);
app.use('/api/ordenes', OrdenRoutes);
app.use('/api/pedidos', PedidoRoutes);
app.use('/api/platos', PlatoRoutes);
app.use('/api/auth', authRoutes);

// Prueba la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

// Sincroniza los modelos
sequelize.sync({ force: true })
    .then(() => {
        console.log('Modelos sincronizados con la base de datos.');
    })
    .catch(err => {
        console.error('Error al sincronizar los modelos:', err);
    });

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido al gestor de restaurante!');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
