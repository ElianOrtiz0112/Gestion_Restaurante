import { Router } from 'express';
import OrdenController from '../controllers/OrdenController';

const router = Router();

// Rutas para Orden
router.post('/', OrdenController.crearOrden);
router.get('/', OrdenController.obtenerOrdenes);
router.get('/:id', OrdenController.obtenerOrden);
router.put('/:id', OrdenController.actualizarOrden);
router.delete('/:id', OrdenController.eliminarOrden);

export default router;
