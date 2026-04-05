import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginValidation, createUserValidation } from '../middleware/validation';
import { UserService } from '../services/userService';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/login', loginValidation, AuthController.login);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);

// Public registration endpoint
router.post(
  '/register',
  createUserValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only allow viewer and analyst self-registration
      if (req.body.role === 'admin') {
        res.status(403).json({
          success: false,
          message: 'Admin accounts cannot be self-registered',
        });
        return;
      }
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'Account created successfully! You can now login.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;