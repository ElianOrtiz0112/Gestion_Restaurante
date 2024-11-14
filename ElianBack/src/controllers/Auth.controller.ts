import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password);
            if (!passwordValido) {
                return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email
                }
            });
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    public async registro(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const usuarioExistente = await Usuario.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).json({ mensaje: 'El email ya está registrado' });
            }

            const usuario = await Usuario.create({
                email,
                password
            });

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            return res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email
                }
            });
        } catch (error) {
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }
}

const authController = new AuthController();
export default authController;