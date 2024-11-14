// src/controllers/OrdenController.ts
import { Request, Response } from 'express';
import Orden from '../models/Orden';

class OrdenController {
    public async crearOrden(req: Request, res: Response) {
        try {
            const orden = await Orden.create(req.body);
            res.status(201).json(orden);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerOrdenes(req: Request, res: Response) {
        try {
            const ordenes = await Orden.findAll();
            res.status(200).json(ordenes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerOrden(req: Request, res: Response) {
        try {
            const orden = await Orden.findByPk(req.params.id);
            if (orden) {
                res.status(200).json(orden);
            } else {
                res.status(404).json({ message: 'Orden no encontrada' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async actualizarOrden(req: Request, res: Response) {
        try {
            const [updated] = await Orden.update(req.body, {
                where: { id: req.params.id },
            });
            if (updated) {
                const updatedOrden = await Orden.findByPk(req.params.id);
                res.status(200).json(updatedOrden);
            } else {
                res.status(404).json({ message: 'Orden no encontrada' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async eliminarOrden(req: Request, res: Response) {
        try {
            const deleted = await Orden.destroy({
                where: { id: req.params.id },
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Orden no encontrada' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new OrdenController();