import { Router, Request, Response } from 'express';
import authController from '../controllers/Auth.controller';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  authController.login(req, res);
});

router.post('/registro', (req: Request, res: Response) => {
  authController.registro(req, res);
});

export default router;