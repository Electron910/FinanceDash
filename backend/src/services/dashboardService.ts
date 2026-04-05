import { TransactionModel } from '../models/Transaction';
import { UserModel } from '../models/User';

// ── Local type helpers ────────────────────────────────────────────────────────
type DbRow = Record<string, unknown>;

function toFloat(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
}

function toInt(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? 0 : parsed;
}

function asRow(value: unknown): DbRow {
  if (typeof value === 'object' && value !== null) {
    return value as DbRow;
  }
  return {};
}

// ── Dashboard Service ─────────────────────────────────────────────────────────
export class DashboardService {

  // ── Summary ───────────────────────────────────────────────────────────────
  static async getSummary(startDate?: string, endDate?: string) {
    const raw = await TransactionModel.getSummary(startDate, endDate);
    const row = asRow(raw);

    return {
      totalIncome:      toFloat(row.total_income),
      totalExpenses:    toFloat(row.total_expenses),
      netBalance:       toFloat(row.net_balance),
      transactionCount: toInt(row.transaction_count),
      incomeCount:      toInt(row.income_count),
      expenseCount:     toInt(row.expense_count),
    };
  }

  // ── Category Totals ───────────────────────────────────────────────────────
  static async getCategoryTotals(type?: string) {
    const rows: unknown[] = await TransactionModel.getCategoryTotals(type);

    return rows.map((item: unknown) => {
      const row = asRow(item);
      return {
        category:   String(row.category   ?? ''),
        type:       String(row.type       ?? ''),
        total:      toFloat(row.total),
        count:      toInt(row.count),
        percentage: toFloat(row.percentage),
      };
    });
  }

  // ── Monthly Trends ────────────────────────────────────────────────────────
  static async getMonthlyTrends(months: number = 12) {
    const rows: unknown[] = await TransactionModel.getMonthlyTrends(months);

    return rows.map((item: unknown) => {
      const row = asRow(item);
      return {
        year:       toInt(row.year),
        month:      toInt(row.month),
        month_name: String(row.month_name ?? ''),
        income:     toFloat(row.income),
        expenses:   toFloat(row.expenses),
        net:        toFloat(row.net),
      };
    });
  }

  // ── Weekly Trends ─────────────────────────────────────────────────────────
  static async getWeeklyTrends(weeks: number = 8) {
    const rows: unknown[] = await TransactionModel.getWeeklyTrends(weeks);

    return rows.map((item: unknown) => {
      const row = asRow(item);
      return {
        week_start: String(row.week_start ?? ''),
        income:     toFloat(row.income),
        expenses:   toFloat(row.expenses),
        net:        toFloat(row.net),
      };
    });
  }

  // ── Recent Activity ───────────────────────────────────────────────────────
  static async getRecentActivity(limit: number = 10) {
    return TransactionModel.getRecentTransactions(limit);
  }

  // ── Full Dashboard ────────────────────────────────────────────────────────
  static async getFullDashboard() {
    const [
      summary,
      categoryTotals,
      monthlyTrends,
      recentActivity,
      totalUsers,
    ] = await Promise.all([
      this.getSummary(),
      this.getCategoryTotals(),
      this.getMonthlyTrends(6),
      this.getRecentActivity(5),
      UserModel.count(),
    ]);

    return {
      summary,
      categoryTotals,
      monthlyTrends,
      recentActivity,
      totalUsers,
    };
  }
}