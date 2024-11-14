import { Router } from 'express';
import PlatoController from '../controllers/PlatoController';

const router = Router();

// Rutas para Plato
router.post('/', PlatoController.crearPlato);
router.get('/', PlatoController.obtenerPlatos);
router.get('/:id', PlatoController.obtenerPlato);
router.put('/:id', PlatoController.actualizarPlato);
router.delete('/:id', PlatoController.eliminarPlato);

export default router;
