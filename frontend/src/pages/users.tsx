import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { userAPI } from '../services/api';
import { UserTable } from '../components/users/UserTable';
import { UserForm } from '../components/users/UserForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: { admin: number; analyst: number; viewer: number };
}

export default function UsersPage() {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-marseille font-semibold text-cream/60">Access Denied</h3>
          <p className="text-sm text-cream/30 mt-1">Admin role required</p>
        </div>
      </div>
    );
  }

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        userAPI.getAll(),
        userAPI.getStats(),
      ]);
      setUsers((usersRes.data.data as User[]) || []);
      setStats(statsRes.data.data as UserStats);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (data: unknown): Promise<boolean> => {
    try {
      await userAPI.create(data);
      toast.success('User created successfully!');
      await fetchUsers();
      setIsFormOpen(false);
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create user';
      toast.error(msg);
      return false;
    }
  };

  const handleUpdate = async (data: unknown): Promise<boolean> => {
    if (!editingUser) return false;
    try {
      await userAPI.update(editingUser.id, data);
      toast.success('User updated successfully!');
      await fetchUsers();
      setEditingUser(null);
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update user';
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      await fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete user';
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await userAPI.update(id, {
        status: currentStatus === 'active' ? 'inactive' : 'active',
      });
      toast.success(`User ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
      await fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <>
      <Head>
        <title>Users — FinanceDash</title>
      </Head>

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-marseille font-bold text-cream">User Management</h2>
            <p className="text-sm text-cream/40 mt-0.5">
              Manage roles and access control
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFormOpen(true)}
            icon={<span>+</span>}
          >
            Add User
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-cream' },
              { label: 'Active', value: stats.active, color: 'text-green-400' },
              { label: 'Inactive', value: stats.inactive, color: 'text-gray-400' },
              { label: 'Admins', value: stats.byRole.admin, color: 'text-sand' },
              { label: 'Analysts', value: stats.byRole.analyst, color: 'text-blue-400' },
              { label: 'Viewers', value: stats.byRole.viewer, color: 'text-purple-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card text-center py-3"
              >
                <p className={`text-2xl font-bold font-marseille ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-cream/40 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-forest-dark/40 border-sand/10"
        >
          <h3 className="text-sm font-semibold text-cream/70 mb-3">Role Permissions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                role: 'viewer' as const,
                icon: '👁',
                perms: ['View dashboard', 'View transactions', 'View summaries'],
              },
              {
                role: 'analyst' as const,
                icon: '📊',
                perms: ['All viewer perms', 'Create transactions', 'Edit transactions', 'View trends'],
              },
              {
                role: 'admin' as const,
                icon: '⚡',
                perms: ['All analyst perms', 'Delete transactions', 'Manage users', 'Full system access'],
              },
            ].map((r) => (
              <div key={r.role} className="p-3 bg-forest-dark/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{r.icon}</span>
                  <Badge variant={r.role} className="capitalize">
                    {r.role}
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {r.perms.map((p) => (
                    <li key={p} className="text-xs text-cream/50 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-sand/50 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <UserTable
          users={users}
          isLoading={loading}
          onEdit={setEditingUser}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create New User"
        size="md"
      >
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        size="md"
      >
        <UserForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingUser(null)}
          initialData={editingUser}
        />
      </Modal>
    </>
  );
}