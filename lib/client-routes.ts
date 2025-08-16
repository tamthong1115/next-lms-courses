import { $path } from 'next-typesafe-url';

export const CLIENT_ROUTES = {
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

export const PUBLIC_ROUTES = {
  HOME: CLIENT_ROUTES.HOME,
} as const;

export const USER_ROUTES = {
  LOGIN: CLIENT_ROUTES.LOGIN,
  COURSES: CLIENT_ROUTES.COURSES,
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: CLIENT_ROUTES.ADMIN_DASHBOARD,
  COURSES: CLIENT_ROUTES.ADMIN_COURSES,
  CREATE_COURSE: CLIENT_ROUTES.CREATE_COURSE,
} as const;
