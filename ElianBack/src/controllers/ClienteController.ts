// src/controllers/ClienteController.ts
import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

class ClienteController {
    public async crearCliente(req: Request, res: Response) {
        try {
            const cliente = await Cliente.create(req.body);
            res.status(201).json(cliente);
        } catch (error: any) { // Especificar el tipo de error
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerClientes(req: Request, res: Response) {
        try {
            const clientes = await Cliente.findAll();
            res.status(200).json(clientes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async obtenerCliente(req: Request, res: Response) {
        try {
            const cliente = await Cliente.findByPk(req.params.id);
            if (cliente) {
                res.status(200).json(cliente);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async actualizarCliente(req: Request, res: Response) {
        try {
            const [updated] = await Cliente.update(req.body, {
                where: { id: req.params.id },
            });
            if (updated) {
                const updatedCliente = await Cliente.findByPk(req.params.id);
                res.status(200).json(updatedCliente);
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async eliminarCliente(req: Request, res: Response) {
        try {
            const deleted = await Cliente.destroy({
                where: { id: req.params.id },
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ClienteController();