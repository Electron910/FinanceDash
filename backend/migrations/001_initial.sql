-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles enum
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'viewer');

-- User status enum
CREATE TYPE user_status AS ENUM ('active', 'inactive');

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  status user_status NOT NULL DEFAULT 'active',
  avatar VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(15, 2) NOT NULL,
  type transaction_type NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  description VARCHAR(500),
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_created_by ON transactions(created_by);
CREATE INDEX idx_transactions_deleted_at ON transactions(deleted_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS 
$$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$
 language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
  'System Admin',
  'admin@financedash.com',
  '\$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgK7GfmTGe.x9GdFcFQXeC',
  'admin',
  'active'
);

-- Seed analyst user (password: Analyst@123)
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
  'Jane Analyst',
  'analyst@financedash.com',
  '\$2b\$12\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'analyst',
  'active'
);

-- Seed viewer user (password: Viewer@123)
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
  'Bob Viewer',
  'viewer@financedash.com',
  '\$2b\$12\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'viewer',
  'active'
);