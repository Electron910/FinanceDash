import { PaginationQuery, PaginatedResponse } from '../types';

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(1, parseInt(String(query.page || 1)));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 10))));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};