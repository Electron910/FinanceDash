import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { signToken } from '../utils/jwt';
import { LoginDto, AuthResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

const SALT_ROUNDS = 12;

export class AuthService {
  static async login(data: LoginDto): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(data.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'inactive') {
      throw new AppError(
        'Your account has been deactivated. Contact administrator.',
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({
      userId: user.id,
      email:  user.email,
      role:   user.role,
    });

    const { password_hash, deleted_at, ...userWithoutPassword } = user;
    void password_hash;
    void deleted_at;

    return { token, user: userWithoutPassword };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}