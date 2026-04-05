import { query } from '../config/database';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
} from '../types';

export class TransactionModel {

  static async findAll(
    filters: TransactionFilters = {},
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Transaction[]; total: number }> {
    const conditions: string[] = ['t.deleted_at IS NULL'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (filters.type) {
      conditions.push('t.type = $' + paramIndex++);
      values.push(filters.type);
    }

    if (filters.category) {
      conditions.push('t.category ILIKE $' + paramIndex++);
      values.push('%' + filters.category + '%');
    }

    if (filters.startDate) {
      conditions.push('t.date >= $' + paramIndex++);
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('t.date <= $' + paramIndex++);
      values.push(filters.endDate);
    }

    if (filters.minAmount !== undefined) {
      conditions.push('t.amount >= $' + paramIndex++);
      values.push(filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      conditions.push('t.amount <= $' + paramIndex++);
      values.push(filters.maxAmount);
    }

    if (filters.search) {
      const p = '$' + paramIndex;
      conditions.push(
        '(t.description ILIKE ' + p + ' OR t.notes ILIKE ' + p + ' OR t.category ILIKE ' + p + ')'
      );
      values.push('%' + filters.search + '%');
      paramIndex++;
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM transactions t ' + whereClause,
      values
    );

    const total = parseInt(countResult.rows[0]?.count ?? '0', 10);

    const limitParam = '$' + paramIndex++;
    const offsetParam = '$' + paramIndex;

    const dataResult = await query<Transaction>(
      'SELECT t.*, u.name AS creator_name, u.email AS creator_email ' +
      'FROM transactions t ' +
      'LEFT JOIN users u ON t.created_by = u.id ' +
      whereClause +
      ' ORDER BY t.date DESC, t.created_at DESC' +
      ' LIMIT ' + limitParam + ' OFFSET ' + offsetParam,
      [...values, limit, offset]
    );

    return { rows: dataResult.rows, total };
  }

  static async findById(id: string): Promise<Transaction | null> {
    const { rows } = await query<Transaction>(
      'SELECT t.*, u.name AS creator_name ' +
      'FROM transactions t ' +
      'LEFT JOIN users u ON t.created_by = u.id ' +
      'WHERE t.id = \$1 AND t.deleted_at IS NULL',
      [id]
    );
    return rows[0] ?? null;
  }

  static async create(
    data: CreateTransactionDto & { created_by: string }
  ): Promise<Transaction> {
    const { rows } = await query<Transaction>(
      'INSERT INTO transactions (amount, type, category, date, notes, description, created_by) ' +
      'VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7) RETURNING *',
      [
        data.amount,
        data.type,
        data.category,
        data.date,
        data.notes ?? null,
        data.description ?? null,
        data.created_by,
      ]
    );
    return rows[0];
  }

  static async update(
    id: string,
    data: UpdateTransactionDto,
    updatedBy: string
  ): Promise<Transaction | null> {
    const fields: string[] = ['updated_by = \$1'];
    const values: unknown[] = [updatedBy];
    let paramIndex = 2;

    if (data.amount      !== undefined) { fields.push('amount = $'      + paramIndex++); values.push(data.amount); }
    if (data.type        !== undefined) { fields.push('type = $'        + paramIndex++); values.push(data.type); }
    if (data.category    !== undefined) { fields.push('category = $'    + paramIndex++); values.push(data.category); }
    if (data.date        !== undefined) { fields.push('date = $'        + paramIndex++); values.push(data.date); }
    if (data.notes       !== undefined) { fields.push('notes = $'       + paramIndex++); values.push(data.notes); }
    if (data.description !== undefined) { fields.push('description = $' + paramIndex++); values.push(data.description); }

    values.push(id);

    const { rows } = await query<Transaction>(
      'UPDATE transactions SET ' + fields.join(', ') +
      ' WHERE id = $' + paramIndex + ' AND deleted_at IS NULL RETURNING *',
      values
    );
    return rows[0] ?? null;
  }

  static async softDelete(id: string): Promise<boolean> {
    const { rowCount } = await query(
      'UPDATE transactions SET deleted_at = NOW() WHERE id = \$1 AND deleted_at IS NULL',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  static async getSummary(
    startDate?: string,
    endDate?: string
  ): Promise<Record<string, unknown>> {
    const conditions: string[] = ['deleted_at IS NULL'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (startDate) { conditions.push('date >= $' + paramIndex++); values.push(startDate); }
    if (endDate)   { conditions.push('date <= $' + paramIndex++); values.push(endDate); }

    const { rows } = await query<Record<string, unknown>>(
      "SELECT " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0       END), 0) AS total_income, " +
      "COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0       END), 0) AS total_expenses, " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net_balance, " +
      "COUNT(*) AS transaction_count, " +
      "COUNT(CASE WHEN type = 'income'  THEN 1 END) AS income_count, " +
      "COUNT(CASE WHEN type = 'expense' THEN 1 END) AS expense_count " +
      'FROM transactions WHERE ' + conditions.join(' AND '),
      values
    );
    return rows[0] ?? {};
  }

  static async getCategoryTotals(type?: string): Promise<unknown[]> {
    const conditions: string[] = ['deleted_at IS NULL'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (type) { conditions.push('type = $' + paramIndex++); values.push(type); }

    const { rows } = await query<unknown>(
      'WITH totals AS (' +
      '  SELECT category, type, SUM(amount) AS total, COUNT(*) AS count ' +
      '  FROM transactions WHERE ' + conditions.join(' AND ') +
      '  GROUP BY category, type' +
      '), grand_total AS (' +
      '  SELECT COALESCE(SUM(total), 1) AS grand_sum FROM totals' +
      ') ' +
      'SELECT t.category, t.type, t.total, t.count, ' +
      'ROUND((t.total / gt.grand_sum * 100)::numeric, 2) AS percentage ' +
      'FROM totals t, grand_total gt ORDER BY t.total DESC',
      values
    );
    return rows;
  }

  static async getMonthlyTrends(months: number = 12): Promise<unknown[]> {
    const { rows } = await query<unknown>(
      "SELECT " +
      "EXTRACT(YEAR  FROM date)::int AS year, " +
      "EXTRACT(MONTH FROM date)::int AS month, " +
      "TO_CHAR(date, 'Mon') AS month_name, " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0       END), 0) AS income, " +
      "COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0       END), 0) AS expenses, " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net " +
      'FROM transactions ' +
      'WHERE deleted_at IS NULL ' +
      "AND date >= (NOW() - (\$1 || ' months')::INTERVAL)::date " +
      'GROUP BY year, month, month_name ' +
      'ORDER BY year ASC, month ASC',
      [months]
    );
    return rows;
  }

  static async getWeeklyTrends(weeks: number = 8): Promise<unknown[]> {
    const { rows } = await query<unknown>(
      "SELECT " +
      "DATE_TRUNC('week', date)::date AS week_start, " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0       END), 0) AS income, " +
      "COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0       END), 0) AS expenses, " +
      "COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net " +
      'FROM transactions ' +
      'WHERE deleted_at IS NULL ' +
      "AND date >= (NOW() - (\$1 || ' weeks')::INTERVAL)::date " +
      'GROUP BY week_start ' +
      'ORDER BY week_start ASC',
      [weeks]
    );
    return rows;
  }

  static async getRecentTransactions(limit: number = 10): Promise<unknown[]> {
    const { rows } = await query<unknown>(
      'SELECT t.*, u.name AS creator_name ' +
      'FROM transactions t ' +
      'LEFT JOIN users u ON t.created_by = u.id ' +
      'WHERE t.deleted_at IS NULL ' +
      'ORDER BY t.created_at DESC ' +
      'LIMIT \$1',
      [limit]
    );
    return rows;
  }

  static async count(): Promise<number> {
    const { rows } = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM transactions WHERE deleted_at IS NULL'
    );
    return parseInt(rows[0]?.count ?? '0', 10);
  }
}
