const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Server error' });
};
export { notFound, errorHandler };
