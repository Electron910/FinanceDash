import bcrypt from 'bcryptjs';
import { query } from './config/database';

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  await query(`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES
      ('System Admin',   'admin@financedash.com',   '${passwordHash}', 'admin',    'active'),
      ('Jane Analyst',   'analyst@financedash.com', '${passwordHash}', 'analyst',  'active'),
      ('Bob Viewer',     'viewer@financedash.com',  '${passwordHash}', 'viewer',   'active')
    ON CONFLICT (email) DO NOTHING
  `);

  console.log('Users seeded');

  const { rows: users } = await query<{ id: string }>(
    'SELECT id FROM users WHERE deleted_at IS NULL LIMIT 1'
  );

  const userId = users[0]?.id;
  if (!userId) {
    console.error('No user found to attach transactions to');
    process.exit(1);
  }

  await query(`
    INSERT INTO transactions (amount, type, category, date, notes, description, created_by)
    VALUES
      (5000.00,  'income',  'Salary',        NOW() - INTERVAL '1 day',   'Monthly salary',          'Salary deposit',          '${userId}'),
      (1200.00,  'income',  'Freelance',     NOW() - INTERVAL '3 days',  'Web design project',      'Client payment',          '${userId}'),
      (800.00,   'income',  'Investments',   NOW() - INTERVAL '5 days',  'Dividend payout',         'Stock dividends',         '${userId}'),
      (350.00,   'expense', 'Rent',          NOW() - INTERVAL '2 days',  'Monthly rent',            'Apartment rent',          '${userId}'),
      (120.00,   'expense', 'Groceries',     NOW() - INTERVAL '4 days',  'Weekly groceries',        'Supermarket',             '${userId}'),
      (60.00,    'expense', 'Utilities',     NOW() - INTERVAL '6 days',  'Electricity bill',        'Power company',           '${userId}'),
      (45.00,    'expense', 'Entertainment', NOW() - INTERVAL '7 days',  'Netflix and Spotify',     'Subscriptions',           '${userId}'),
      (200.00,   'expense', 'Transport',     NOW() - INTERVAL '8 days',  'Monthly bus pass',        'Public transport',        '${userId}'),
      (3500.00,  'income',  'Salary',        NOW() - INTERVAL '32 days', 'Monthly salary',          'Salary deposit',          '${userId}'),
      (900.00,   'income',  'Freelance',     NOW() - INTERVAL '35 days', 'Logo design',             'Client payment',          '${userId}'),
      (400.00,   'expense', 'Rent',          NOW() - INTERVAL '33 days', 'Monthly rent',            'Apartment rent',          '${userId}'),
      (90.00,    'expense', 'Groceries',     NOW() - INTERVAL '36 days', 'Weekly groceries',        'Supermarket',             '${userId}'),
      (4200.00,  'income',  'Salary',        NOW() - INTERVAL '62 days', 'Monthly salary',          'Salary deposit',          '${userId}'),
      (600.00,   'income',  'Investments',   NOW() - INTERVAL '65 days', 'Crypto profit',           'Crypto exchange',         '${userId}'),
      (380.00,   'expense', 'Rent',          NOW() - INTERVAL '63 days', 'Monthly rent',            'Apartment rent',          '${userId}'),
      (150.00,   'expense', 'Healthcare',    NOW() - INTERVAL '66 days', 'Doctor visit',            'Medical clinic',          '${userId}'),
      (5200.00,  'income',  'Salary',        NOW() - INTERVAL '92 days', 'Monthly salary',          'Salary deposit',          '${userId}'),
      (250.00,   'expense', 'Transport',     NOW() - INTERVAL '95 days', 'Car service',             'Auto workshop',           '${userId}'),
      (75.00,    'expense', 'Utilities',     NOW() - INTERVAL '94 days', 'Water bill',              'Water company',           '${userId}'),
      (4800.00,  'income',  'Salary',        NOW() - INTERVAL '122 days','Monthly salary',          'Salary deposit',          '${userId}'),
      (1500.00,  'income',  'Freelance',     NOW() - INTERVAL '125 days','App development',         'Client payment',          '${userId}'),
      (420.00,   'expense', 'Rent',          NOW() - INTERVAL '123 days','Monthly rent',            'Apartment rent',          '${userId}'),
      (200.00,   'expense', 'Entertainment', NOW() - INTERVAL '126 days','Concert tickets',         'Event booking',           '${userId}'),
      (5100.00,  'income',  'Salary',        NOW() - INTERVAL '152 days','Monthly salary',          'Salary deposit',          '${userId}'),
      (300.00,   'expense', 'Healthcare',    NOW() - INTERVAL '155 days','Dental checkup',          'Dental clinic',           '${userId}'),
      (180.00,   'expense', 'Groceries',     NOW() - INTERVAL '153 days','Monthly groceries',       'Supermarket',             '${userId}'),
      (4600.00,  'income',  'Salary',        NOW() - INTERVAL '182 days','Monthly salary',          'Salary deposit',          '${userId}'),
      (700.00,   'income',  'Investments',   NOW() - INTERVAL '185 days','Bond returns',            'Investment fund',         '${userId}'),
      (390.00,   'expense', 'Rent',          NOW() - INTERVAL '183 days','Monthly rent',            'Apartment rent',          '${userId}'),
      (110.00,   'expense', 'Utilities',     NOW() - INTERVAL '186 days','Gas bill',                'Gas company',             '${userId}')
    ON CONFLICT DO NOTHING
  `);

  console.log('Transactions seeded');
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});