import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Simple console logger to avoid circular dependency
const log = {
  info:  (msg: string) => console.log(`[DB] ${new Date().toISOString()} INFO:  ${msg}`),
  error: (msg: string, err?: unknown) => console.error(`[DB] ${new Date().toISOString()} ERROR: ${msg}`, err || ''),
  debug: (msg: string) => process.env.NODE_ENV !== 'production' && console.log(`[DB] ${new Date().toISOString()} DEBUG: ${msg}`),
};

const dbConfig: PoolConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'finance_dashboard',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max:                  20,
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
};

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: dbConfig.ssl,
    })
  : new Pool(dbConfig);

pool.on('error', (err) => {
  log.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  log.info('New database connection established');
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now');
    log.info(`Database connected at: ${result.rows[0].now}`);
    client.release();
  } catch (error) {
    log.error('Failed to connect to database', error);
    throw error;
  }
};

export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    log.debug(`Query executed in ${duration}ms`);
    return {
      rows:     result.rows as T[],
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    log.error(`Query error: ${text.substring(0, 80)}`, error);
    throw error;
  }
};

export default pool;