import { Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../types';

export class UserController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        meta: { count: users.length },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id, req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await UserService.getUserStats();
      res.status(200).json({
        success: true,
        message: 'User statistics retrieved',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}