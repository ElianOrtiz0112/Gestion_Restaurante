import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado' });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        (req as any).user = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
} 