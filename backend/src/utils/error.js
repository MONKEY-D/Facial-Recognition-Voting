export const errorHandler = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error;
}

export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error occurred";
  res.status(status).json({ message });
};