import { ErrorResp } from '@blazjs/common'

export const UserErrors = {
  UserNotFound: new ErrorResp('error.userNotFound', 'User not found'),
  InvalidCredentials: new ErrorResp('error.invalidCredentials', 'Invalid email or password'),
  InvalidResetPasswordToken: new ErrorResp(
    'error.invalidResetPasswordToken',
    'Invalid reset password token',
  ),
  PasswordUnchanged: new ErrorResp(
    'error.passwordUnchanged',
    'The new password must be different from the old password',
  ),
  InvalidPassword: new ErrorResp('error.invalidPassword', 'The password is incorrect'),
}
