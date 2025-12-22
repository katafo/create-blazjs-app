import { ErrorResp } from '@blazjs/common'

export const AppError = {
  BadRequest: new ErrorResp('error.badRequest', 'Bad request', 400),
  Unauthorized: new ErrorResp('error.unauthorized', 'Unauthorized', 401),
  Forbidden: new ErrorResp('error.forbiden', 'Forbidden', 403),
  TooManyRequests: new ErrorResp(
    'error.tooManyRequests',
    'Too many requests, please try again later.',
    429,
  ),
  InternalServerError: new ErrorResp('error.internalServerError', 'Internal server error.', 500),
}
