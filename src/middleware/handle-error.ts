import { ErrorRequestHandler } from "express";

export const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return
  }

  const status = error?.status ?? error?.statusCode;

  if (Number.isInteger(status) && status >= 400 && status < 500) {
    const message = error.type === 'entity.parse.failed'
      ? 'Invalid JSON body'
      : 'Invalid request';

    res.status(status).json({ message });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}