import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinanceDash API',
      version: '1.0.0',
      description: 'REST API for FinanceDash — Professional Finance Management Dashboard',
      contact: {
        name: 'FinanceDash Support',
        email: 'admin@financedash.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://your-backend.railway.app/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:         { type: 'string', format: 'uuid' },
            name:       { type: 'string', example: 'System Admin' },
            email:      { type: 'string', example: 'admin@financedash.com' },
            role:       { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
            status:     { type: 'string', enum: ['active', 'inactive'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id:           { type: 'string', format: 'uuid' },
            amount:       { type: 'number', example: 5000.00 },
            type:         { type: 'string', enum: ['income', 'expense'] },
            category:     { type: 'string', example: 'Salary' },
            date:         { type: 'string', format: 'date', example: '2026-04-04' },
            notes:        { type: 'string', example: 'Monthly salary' },
            description:  { type: 'string', example: 'Salary deposit' },
            created_by:   { type: 'string', format: 'uuid' },
            creator_name: { type: 'string', example: 'System Admin' },
            created_at:   { type: 'string', format: 'date-time' },
          },
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            totalIncome:      { type: 'number', example: 32400 },
            totalExpenses:    { type: 'number', example: 3420 },
            netBalance:       { type: 'number', example: 28980 },
            transactionCount: { type: 'number', example: 30 },
            incomeCount:      { type: 'number', example: 13 },
            expenseCount:     { type: 'number', example: 17 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', example: 'admin@financedash.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user:  { '$ref': '#/components/schemas/User' },
              },
            },
          },
        },
        CreateTransactionRequest: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount:      { type: 'number', example: 2500.00 },
            type:        { type: 'string', enum: ['income', 'expense'] },
            category:    { type: 'string', example: 'Freelance' },
            date:        { type: 'string', format: 'date', example: '2026-04-04' },
            notes:       { type: 'string', example: 'New project payment' },
            description: { type: 'string', example: 'Client payment received' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data:    { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data:    { type: 'array', items: { '$ref': '#/components/schemas/Transaction' } },
            pagination: {
              type: 'object',
              properties: {
                page:       { type: 'number' },
                limit:      { type: 'number' },
                total:      { type: 'number' },
                totalPages: { type: 'number' },
                hasNext:    { type: 'boolean' },
                hasPrev:    { type: 'boolean' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { '$ref': '#/components/schemas/LoginResponse' },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { '$ref': '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          responses: {
            200: {
              description: 'Current user data',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { '$ref': '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: { '$ref': '#/components/schemas/User' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          responses: {
            200: { description: 'Logged out successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get financial summary',
          parameters: [
            { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' }, example: '2026-01-01' },
            { in: 'query', name: 'endDate',   schema: { type: 'string', format: 'date' }, example: '2026-12-31' },
          ],
          responses: {
            200: {
              description: 'Dashboard summary',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { '$ref': '#/components/schemas/ApiResponse' },
                      {
                        properties: {
                          data: { '$ref': '#/components/schemas/DashboardSummary' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/dashboard/trends/monthly': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get monthly trends',
          parameters: [
            { in: 'query', name: 'months', schema: { type: 'number', default: 6 }, example: 6 },
          ],
          responses: {
            200: { description: 'Monthly trend data' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/dashboard/trends/weekly': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get weekly trends',
          parameters: [
            { in: 'query', name: 'weeks', schema: { type: 'number', default: 8 }, example: 8 },
          ],
          responses: {
            200: { description: 'Weekly trend data' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/dashboard/categories': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get category totals',
          parameters: [
            { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'] } },
          ],
          responses: {
            200: { description: 'Category totals' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'Get all transactions',
          parameters: [
            { in: 'query', name: 'page',      schema: { type: 'number', default: 1 } },
            { in: 'query', name: 'limit',     schema: { type: 'number', default: 15 } },
            { in: 'query', name: 'type',      schema: { type: 'string', enum: ['income', 'expense'] } },
            { in: 'query', name: 'category',  schema: { type: 'string' }, example: 'Salary' },
            { in: 'query', name: 'search',    schema: { type: 'string' }, example: 'grocery' },
            { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
            { in: 'query', name: 'endDate',   schema: { type: 'string', format: 'date' } },
            { in: 'query', name: 'minAmount', schema: { type: 'number' } },
            { in: 'query', name: 'maxAmount', schema: { type: 'number' } },
          ],
          responses: {
            200: {
              description: 'Paginated transactions',
              content: {
                'application/json': {
                  schema: { '$ref': '#/components/schemas/PaginatedResponse' },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Transactions'],
          summary: 'Create transaction',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/CreateTransactionRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Transaction created' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/transactions/{id}': {
        get: {
          tags: ['Transactions'],
          summary: 'Get transaction by ID',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Transaction data' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          tags: ['Transactions'],
          summary: 'Update transaction',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/CreateTransactionRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Transaction updated' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          tags: ['Transactions'],
          summary: 'Delete transaction',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Transaction deleted' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (Admin only)',
          responses: {
            200: { description: 'List of users' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Create user (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'role'],
                  properties: {
                    name:     { type: 'string', example: 'New User' },
                    email:    { type: 'string', example: 'user@financedash.com' },
                    password: { type: 'string', example: 'password123' },
                    role:     { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID (Admin only)',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'User data' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update user (Admin only)',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name:   { type: 'string' },
                    email:  { type: 'string' },
                    role:   { type: 'string', enum: ['admin', 'analyst', 'viewer'] },
                    status: { type: 'string', enum: ['active', 'inactive'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User updated' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user (Admin only)',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'User deleted' },
            404: { description: 'Not found' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);