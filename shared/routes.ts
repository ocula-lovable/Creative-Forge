import { z } from 'zod';
import { insertProjectSchema, insertAssetSchema, projects, assets, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  assets: {
    list: {
      method: 'GET' as const,
      path: '/api/assets',
      input: z.object({
        projectId: z.coerce.number().optional(),
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof assets.$inferSelect>()),
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/generate',
      input: z.object({
        projectId: z.number().optional(),
        type: z.enum(['video', 'image', 'text', 'avatar']),
        prompt: z.string().min(1),
        style: z.string().optional(),
        duration: z.number().optional(),
        aspectRatio: z.string().optional(),
      }),
      responses: {
        202: z.custom<typeof assets.$inferSelect>(), // Accepted/Pending
        400: errorSchemas.validation,
        402: z.object({ message: z.string() }), // Payment required (not enough credits)
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/assets/:id',
      responses: {
        200: z.custom<typeof assets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
