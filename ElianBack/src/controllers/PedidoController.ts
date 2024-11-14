// src/controllers/PedidoController.ts
import { Request, Response } from 'express';
import Pedido from '../models/Pedido';

class PedidoController {
    public async crearPedido(req: Request, res: Response) {
        try {
            const pedido = await Pedido.create(req.body);
            res.status(201).json(pedido);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerPedidos(req: Request, res: Response) {
        try {
            const pedidos = await Pedido.findAll();
            res.status(200).json(pedidos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerPedido(req: Request, res: Response) {
        try {
            const pedido = await Pedido.findByPk(req.params.id);
            if (pedido) {
                res.status(200).json(pedido);
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async actualizarPedido(req: Request, res: Response) {
        try {
            const [updated] = await Pedido.update(req.body, {
                where: { id: req.params.id },
            });
            if (updated) {
                const updatedPedido = await Pedido.findByPk(req.params.id);
                res.status(200).json(updatedPedido);
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async eliminarPedido(req: Request, res: Response) {
        try {
            const deleted = await Pedido.destroy({
                where: { id: req.params.id },
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PedidoController();