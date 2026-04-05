const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'finance_dashboard',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function fixPasswords() {
  const client = await pool.connect();

  try {
    console.log('Connecting to database...');
    console.log('DB Host:', process.env.DB_HOST || 'localhost');
    console.log('DB Name:', process.env.DB_NAME || 'finance_dashboard');
    console.log('DB User:', process.env.DB_USER || 'postgres');
    console.log('');

    // First check what users exist
    const existing = await client.query('SELECT id, email, role FROM users');
    console.log('Current users in database:');
    existing.rows.forEach(u => console.log(' -', u.email, '|', u.role));
    console.log('');

    if (existing.rows.length === 0) {
      console.log('No users found! Creating users from scratch...');

      // Generate hashes
      const adminHash   = await bcrypt.hash('Admin@123',   10);
      const analystHash = await bcrypt.hash('Analyst@123', 10);
      const viewerHash  = await bcrypt.hash('Viewer@123',  10);

      await client.query(
        `INSERT INTO users (name, email, password_hash, role, status) VALUES
         ('System Admin',  'admin@financedash.com',   \$1, 'admin',   'active'),
         ('Jane Analyst',  'analyst@financedash.com', \$2, 'analyst', 'active'),
         ('Bob Viewer',    'viewer@financedash.com',  \$3, 'viewer',  'active')`,
        [adminHash, analystHash, viewerHash]
      );

      console.log('Users created successfully!');

    } else {
      console.log('Updating password hashes...');

      // Generate fresh hashes
      const adminHash   = await bcrypt.hash('Admin@123',   10);
      const analystHash = await bcrypt.hash('Analyst@123', 10);
      const viewerHash  = await bcrypt.hash('Viewer@123',  10);

      // Update each user
      await client.query(
        `UPDATE users SET password_hash = \$1 WHERE email = 'admin@financedash.com'`,
        [adminHash]
      );
      await client.query(
        `UPDATE users SET password_hash = \$1 WHERE email = 'analyst@financedash.com'`,
        [analystHash]
      );
      await client.query(
        `UPDATE users SET password_hash = \$1 WHERE email = 'viewer@financedash.com'`,
        [viewerHash]
      );

      console.log('Passwords updated!');
    }

    // Verify by testing bcrypt comparison
    console.log('\nVerifying password hashes...');

    const adminUser = await client.query(
      `SELECT email, password_hash FROM users WHERE email = 'admin@financedash.com'`
    );

    if (adminUser.rows.length > 0) {
      const hash = adminUser.rows[0].password_hash;
      const isValid = await bcrypt.compare('Admin@123', hash);
      console.log('Admin password valid:', isValid ? 'YES ✓' : 'NO ✗');
      console.log('Hash preview:', hash.substring(0, 30) + '...');
    }

    const analystUser = await client.query(
      `SELECT email, password_hash FROM users WHERE email = 'analyst@financedash.com'`
    );

    if (analystUser.rows.length > 0) {
      const hash = analystUser.rows[0].password_hash;
      const isValid = await bcrypt.compare('Analyst@123', hash);
      console.log('Analyst password valid:', isValid ? 'YES ✓' : 'NO ✗');
    }

    const viewerUser = await client.query(
      `SELECT email, password_hash FROM users WHERE email = 'viewer@financedash.com'`
    );

    if (viewerUser.rows.length > 0) {
      const hash = viewerUser.rows[0].password_hash;
      const isValid = await bcrypt.compare('Viewer@123', hash);
      console.log('Viewer password valid:', isValid ? 'YES ✓' : 'NO ✗');
    }

    // Show final state
    const final = await client.query(
      `SELECT email, role, status, LEFT(password_hash, 7) as hash_start FROM users WHERE deleted_at IS NULL`
    );

    console.log('\nFinal user state:');
    final.rows.forEach(u => {
      console.log(` - ${u.email} | ${u.role} | ${u.status} | hash: ${u.hash_start}...`);
    });

    console.log('\n✅ Done! Try logging in now with:');
    console.log('   admin@financedash.com    / Admin@123');
    console.log('   analyst@financedash.com  / Analyst@123');
    console.log('   viewer@financedash.com   / Viewer@123');

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixPasswords();