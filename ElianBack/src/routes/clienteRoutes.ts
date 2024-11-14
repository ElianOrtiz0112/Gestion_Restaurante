import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();

// Rutas para Cliente
router.post('/', ClienteController.crearCliente);
router.get('/', ClienteController.obtenerClientes);
router.get('/:id', ClienteController.obtenerCliente);
router.put('/:id', ClienteController.actualizarCliente);
router.delete('/:id', ClienteController.eliminarCliente);

export default router;
