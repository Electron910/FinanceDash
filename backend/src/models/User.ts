import { query } from '../config/database';
import { User, CreateUserDto, UpdateUserDto } from '../types';

export class UserModel {

  static async findAll(includeDeleted = false): Promise<User[]> {
    const sql = includeDeleted
      ? 'SELECT * FROM users ORDER BY created_at DESC'
      : 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC';
    const { rows } = await query<User>(sql);
    return rows;
  }

  static async findById(id: string): Promise<User | null> {
    const { rows } = await query<User>(
      'SELECT * FROM users WHERE id = \$1 AND deleted_at IS NULL',
      [id]
    );
    return rows[0] ?? null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await query<User>(
      'SELECT * FROM users WHERE email = \$1 AND deleted_at IS NULL',
      [email]
    );
    return rows[0] ?? null;
  }

  static async create(
    data: CreateUserDto & { password_hash: string }
  ): Promise<User> {
    const { rows } = await query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (\$1, \$2, \$3, \$4)
       RETURNING *`,
      [data.name, data.email, data.password_hash, data.role]
    );
    return rows[0];
  }

  static async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = 
$$
{paramIndex++}`);
      values.push(data.name);
    }

    if (data.email !== undefined) {
      fields.push(`email =
$$
{paramIndex++}`);
      values.push(data.email);
    }

    if (data.role !== undefined) {
      fields.push(`role = 
$$
{paramIndex++}`);
      values.push(data.role);
    }

    if (data.status !== undefined) {
      fields.push(`status =
$$
{paramIndex++}`);
      values.push(data.status);
    }

    if (data.avatar !== undefined) {
      fields.push(`avatar = 
$$
{paramIndex++}`);
      values.push(data.avatar);
    }

    if (fields.length === 0) return null;

    values.push(id);

    const { rows } = await query<User>(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE id =
$$
{paramIndex} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return rows[0] ?? null;
  }

  static async softDelete(id: string): Promise<boolean> {
    const { rowCount } = await query(
      'UPDATE users SET deleted_at = NOW() WHERE id = \$1 AND deleted_at IS NULL',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  static async updatePassword(
    id: string,
    passwordHash: string
  ): Promise<boolean> {
    const { rowCount } = await query(
      'UPDATE users SET password_hash = \$1 WHERE id = \$2 AND deleted_at IS NULL',
      [passwordHash, id]
    );
    return (rowCount ?? 0) > 0;
  }

  static async count(): Promise<number> {
    const { rows } = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL'
    );
    return parseInt(rows[0]?.count ?? '0', 10);
  }
}