import bcrypt from 'bcryptjs';
import { query } from '../config/database';

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  await query(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES
       (\$1,  \$2,  \$3, 'admin',   'active'),
       (\$4,  \$5,  \$6, 'analyst', 'active'),
       (\$7,  \$8,  \$9, 'viewer',  'active')
     ON CONFLICT (email) DO NOTHING`,
    [
      'System Admin',  'admin@financedash.com',   passwordHash,
      'Jane Analyst',  'analyst@financedash.com', passwordHash,
      'Bob Viewer',    'viewer@financedash.com',  passwordHash,
    ]
  );

  console.log('Users seeded');

  const { rows: users } = await query<{ id: string }>(
    `SELECT id FROM users WHERE deleted_at IS NULL ORDER BY created_at ASC LIMIT 1`
  );

  const userId = users[0]?.id;

  if (!userId) {
    console.error('No user found');
    process.exit(1);
  }

  const transactions = [
    [5000.00,  'income',  'Salary',        '1 day',    'Monthly salary',        'Salary deposit'   ],
    [1200.00,  'income',  'Freelance',     '3 days',   'Web design project',    'Client payment'   ],
    [800.00,   'income',  'Investments',   '5 days',   'Dividend payout',       'Stock dividends'  ],
    [350.00,   'expense', 'Rent',          '2 days',   'Monthly rent',          'Apartment rent'   ],
    [120.00,   'expense', 'Groceries',     '4 days',   'Weekly groceries',      'Supermarket'      ],
    [60.00,    'expense', 'Utilities',     '6 days',   'Electricity bill',      'Power company'    ],
    [45.00,    'expense', 'Entertainment', '7 days',   'Netflix subscription',  'Subscriptions'    ],
    [200.00,   'expense', 'Transport',     '8 days',   'Monthly bus pass',      'Public transport' ],
    [3500.00,  'income',  'Salary',        '32 days',  'Monthly salary',        'Salary deposit'   ],
    [900.00,   'income',  'Freelance',     '35 days',  'Logo design',           'Client payment'   ],
    [400.00,   'expense', 'Rent',          '33 days',  'Monthly rent',          'Apartment rent'   ],
    [90.00,    'expense', 'Groceries',     '36 days',  'Weekly groceries',      'Supermarket'      ],
    [4200.00,  'income',  'Salary',        '62 days',  'Monthly salary',        'Salary deposit'   ],
    [600.00,   'income',  'Investments',   '65 days',  'Crypto profit',         'Crypto exchange'  ],
    [380.00,   'expense', 'Rent',          '63 days',  'Monthly rent',          'Apartment rent'   ],
    [150.00,   'expense', 'Healthcare',    '66 days',  'Doctor visit',          'Medical clinic'   ],
    [5200.00,  'income',  'Salary',        '92 days',  'Monthly salary',        'Salary deposit'   ],
    [250.00,   'expense', 'Transport',     '95 days',  'Car service',           'Auto workshop'    ],
    [75.00,    'expense', 'Utilities',     '94 days',  'Water bill',            'Water company'    ],
    [4800.00,  'income',  'Salary',        '122 days', 'Monthly salary',        'Salary deposit'   ],
    [1500.00,  'income',  'Freelance',     '125 days', 'App development',       'Client payment'   ],
    [420.00,   'expense', 'Rent',          '123 days', 'Monthly rent',          'Apartment rent'   ],
    [200.00,   'expense', 'Entertainment', '126 days', 'Concert tickets',       'Event booking'    ],
    [5100.00,  'income',  'Salary',        '152 days', 'Monthly salary',        'Salary deposit'   ],
    [300.00,   'expense', 'Healthcare',    '155 days', 'Dental checkup',        'Dental clinic'    ],
    [180.00,   'expense', 'Groceries',     '153 days', 'Monthly groceries',     'Supermarket'      ],
    [4600.00,  'income',  'Salary',        '182 days', 'Monthly salary',        'Salary deposit'   ],
    [700.00,   'income',  'Investments',   '185 days', 'Bond returns',          'Investment fund'  ],
    [390.00,   'expense', 'Rent',          '183 days', 'Monthly rent',          'Apartment rent'   ],
    [110.00,   'expense', 'Utilities',     '186 days', 'Gas bill',              'Gas company'      ],
  ];

  for (const [amount, type, category, interval, notes, description] of transactions) {
    await query(
      `INSERT INTO transactions (amount, type, category, date, notes, description, created_by)
       VALUES (\$1, \$2, \$3, NOW() - \$4::INTERVAL, \$5, \$6, \$7)`,
      [amount, type, category, interval, notes, description, userId]
    );
  }

  console.log('Transactions seeded');
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});