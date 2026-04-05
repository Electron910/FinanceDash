import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionFilters as Filters } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TransactionFiltersProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
}

const CATEGORIES = [
  'salary', 'freelance', 'investment', 'rental_income', 'bonus',
  'food_&_dining', 'transport', 'utilities', 'entertainment', 'healthcare',
  'shopping', 'education', 'rent', 'insurance', 'taxes', 'other',
];

export const TransactionFiltersPanel: React.FC<TransactionFiltersProps> = ({
  filters,
  onApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onApply({});
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<span>⚙</span>}
      >
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 w-4 h-4 rounded-full bg-sand text-forest-dark text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 w-80 z-20
                bg-forest border border-white/10 rounded-2xl shadow-card-hover p-5 space-y-4"
            >
              <h3 className="font-marseille font-semibold text-cream">Filter Transactions</h3>

              {/* Search */}
              <Input
                label="Search"
                type="text"
                placeholder="Search description, notes..."
                value={localFilters.search || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
              />

              {/* Type */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-cream/80">Type</label>
                <select
                  className="input-field"
                  value={localFilters.type || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      type: (e.target.value as 'income' | 'expense') || undefined,
                    })
                  }
                >
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-cream/80">Category</label>
                <select
                  className="input-field"
                  value={localFilters.category || ''}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, category: e.target.value || undefined })
                  }
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, startDate: e.target.value || undefined })
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, endDate: e.target.value || undefined })
                  }
                />
              </div>

              {/* Amount Range */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min Amount"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={localFilters.minAmount || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minAmount: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  label="Max Amount"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={localFilters.maxAmount || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxAmount: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={handleReset} fullWidth>
                  Reset
                </Button>
                <Button variant="primary" size="sm" onClick={handleApply} fullWidth>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};