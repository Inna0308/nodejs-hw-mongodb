import createError from 'http-errors';

export const notFoundHandler = (req, res) => {
  const error = createError(404, 'Route not found');
  next(error);
};
