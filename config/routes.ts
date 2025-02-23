export const publicRoutes = [
  '/api/auth/signin',
  '/api/auth/signup',
  '/',
  '/about'
];

export const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path);
};
