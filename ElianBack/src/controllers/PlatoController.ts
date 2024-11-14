// src/controllers/PlatoController.ts
import { Request, Response } from 'express';
import Plato from '../models/Plato';

class PlatoController {
    public async crearPlato(req: Request, res: Response) {
        try {
            const plato = await Plato.create(req.body);
            res.status(201).json(plato);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerPlatos(req: Request, res: Response) {
        try {
            const platos = await Plato.findAll();
            res.status(200).json(platos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerPlato(req: Request, res: Response) {
        try {
            const plato = await Plato.findByPk(req.params.id);
            if (plato) {
                res.status(200).json(plato);
            } else {
                res.status(404).json({ message: 'Plato no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async actualizarPlato(req: Request, res: Response) {
        try {
            const [updated] = await Plato.update(req.body, {
                where: { id: req.params.id },
            });
            if (updated) {
                const updatedPlato = await Plato.findByPk(req.params.id);
                res.status(200).json(updatedPlato);
            } else {
                res.status(404).json({ message: 'Plato no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async eliminarPlato(req: Request, res: Response) {
        try {
            const deleted = await Plato.destroy({
                where: { id: req.params.id },
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Plato no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PlatoController();