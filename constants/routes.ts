import { $path } from 'next-typesafe-url';

export const ROUTES = {
  // Public routes
  HOME: () => $path({ route: '/' }),

  // User routes
  LOGIN: () => $path({ route: '/login' }),
  COURSES: () => $path({ route: '/courses' }),

  // Admin routes
  ADMIN_DASHBOARD: () => $path({ route: '/admin' }),
  ADMIN_COURSES: () => $path({ route: '/admin/courses' }),
  CREATE_COURSE: () => $path({ route: '/admin/courses/create' }),
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: ROUTES.ADMIN_DASHBOARD,
  COURSES: ROUTES.ADMIN_COURSES,
  CREATE_COURSE: ROUTES.CREATE_COURSE,
} as const;
