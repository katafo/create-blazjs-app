import { AuthRequestDTO } from '@app/auth/auth.request'
import { PASSWORD_REGEX } from '@utils/regex.util'
import { Expose } from 'class-transformer'
import { IsString, Matches } from 'class-validator'

export interface UserChangePasswordDTO {
  userId: string
  oldPassword: string
  newPassword: string
}

export class UserChangePasswordReqDTO extends AuthRequestDTO implements UserChangePasswordDTO {
  @Expose()
  @IsString()
  oldPassword: string

  @Expose()
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be at least 8 characters and contain at least one uppercase letter',
  })
  newPassword: string
}
