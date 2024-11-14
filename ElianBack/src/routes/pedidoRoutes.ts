import { Router } from 'express';
import PedidoController from '../controllers/PedidoController';

const router = Router();

// Rutas para Pedido
router.post('/', PedidoController.crearPedido);
router.get('/', PedidoController.obtenerPedidos);
router.get('/:id', PedidoController.obtenerPedido);
router.put('/:id', PedidoController.actualizarPedido);
router.delete('/:id', PedidoController.eliminarPedido);

export default router;
