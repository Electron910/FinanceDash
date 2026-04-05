import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { user: currentUser } = useAuth();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleConfirmDelete = async (id: string) => {
    if (onDelete) await onDelete(id);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="card overflow-hidden p-0">
        <div className="divide-y divide-white/3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-forest-dark/60 shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-forest-dark/60 rounded w-1/3 shimmer" />
                <div className="h-2 bg-forest-dark/60 rounded w-1/2 shimmer" />
              </div>
              <div className="h-5 w-16 bg-forest-dark/60 rounded-full shimmer" />
              <div className="h-5 w-14 bg-forest-dark/60 rounded-full shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card py-16 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="text-lg font-marseille font-semibold text-cream/60">No users found</h3>
        <p className="text-sm text-cream/30 mt-1">Create a new user to get started</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-forest-dark/30">
              {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-cream/40 uppercase
                    tracking-wider px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/3">
            <AnimatePresence initial={false}>
              {users.map((u, idx) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="table-row-hover group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-sand/60 to-sand/30
                          flex items-center justify-center text-forest-dark font-bold text-sm flex-shrink-0"
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cream">
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-sand">(you)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-cream/50">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.role}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.status}>{u.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-cream/40">
                    {format(new Date(u.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                            text-cream/40 hover:text-sand hover:bg-sand/10 transition-colors"
                          title="Edit user"
                        >
                          ✎
                        </motion.button>
                      )}
                      {onToggleStatus && u.id !== currentUser?.id && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onToggleStatus(u.id, u.status)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg
                            transition-colors ${
                              u.status === 'active'
                                ? 'text-cream/40 hover:text-yellow-400 hover:bg-yellow-500/10'
                                : 'text-cream/40 hover:text-green-400 hover:bg-green-500/10'
                            }`}
                          title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {u.status === 'active' ? '⊘' : '⊕'}
                        </motion.button>
                      )}
                      {onDelete && u.id !== currentUser?.id && (
                        <>
                          {deleteConfirmId === u.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleConfirmDelete(u.id)}
                                className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400
                                  hover:bg-red-500/30 text-xs font-medium transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded-lg bg-white/5 text-cream/40
                                  hover:bg-white/10 text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteConfirmId(u.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg
                                text-cream/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete user"
                            >
                              ✕
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/5">
        {users.map((u, idx) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand/60 to-sand/30
                flex items-center justify-center text-forest-dark font-bold flex-shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream truncate">{u.name}</p>
                <p className="text-xs text-cream/40 truncate">{u.email}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant={u.role}>{u.role}</Badge>
                  <Badge variant={u.status}>{u.status}</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(u)}
                  className="text-xs text-sand px-2 py-1 bg-sand/10 rounded transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && u.id !== currentUser?.id && (
                <button
                  onClick={() => setDeleteConfirmId(u.id)}
                  className="text-xs text-red-400 px-2 py-1 bg-red-500/10 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};