import { UserModel } from '../models/User';
import { AuthService } from './authService';
import { CreateUserDto, UpdateUserDto, User } from '../types';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  static async getAllUsers(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await UserModel.findAll();
    return users.map(({ password_hash, ...user }) => {
      void password_hash;
      return user;
    });
  }

  static async getUserById(
    id: string
  ): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password_hash, ...userWithoutPassword } = user;
    void password_hash;
    return userWithoutPassword;
  }

  static async createUser(
    data: CreateUserDto
  ): Promise<Omit<User, 'password_hash'>> {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('A user with this email already exists', 409);
    }

    const password_hash = await AuthService.hashPassword(data.password);
    const user = await UserModel.create({ ...data, password_hash });

    const { password_hash: _, ...userWithoutPassword } = user;
    void _;
    return userWithoutPassword;
  }

  static async updateUser(
    id: string,
    data: UpdateUserDto,
    requesterId: string
  ): Promise<Omit<User, 'password_hash'>> {
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== existingUser.email) {
      const emailUser = await UserModel.findByEmail(data.email);
      if (emailUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    if (id === requesterId && data.role && data.role !== 'admin') {
      throw new AppError('Cannot change your own admin role', 400);
    }

    const updated = await UserModel.update(id, data);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }

    const { password_hash, ...userWithoutPassword } = updated;
    void password_hash;
    return userWithoutPassword;
  }

  static async deleteUser(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const deleted = await UserModel.softDelete(id);
    if (!deleted) {
      throw new AppError('Failed to delete user', 500);
    }
  }

  static async getUserStats() {
    const users = await UserModel.findAll();
    return {
      total:    users.length,
      active:   users.filter((u) => u.status === 'active').length,
      inactive: users.filter((u) => u.status === 'inactive').length,
      byRole: {
        admin:   users.filter((u) => u.role === 'admin').length,
        analyst: users.filter((u) => u.role === 'analyst').length,
        viewer:  users.filter((u) => u.role === 'viewer').length,
      },
    };
  }
}