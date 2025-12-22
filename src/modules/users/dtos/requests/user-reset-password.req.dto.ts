import { DataRequestDTO } from '@blazjs/common'
import { PASSWORD_REGEX } from '@utils/regex.util'
import { Expose } from 'class-transformer'
import { IsJWT, Matches } from 'class-validator'

export interface UserResetPasswordDTO {
  token: string
  newPassword: string
}

export class UserResetPasswordReqDTO extends DataRequestDTO implements UserResetPasswordDTO {
  @Expose()
  @IsJWT()
  token: string

  @Expose()
  @Matches(PASSWORD_REGEX, {
    message: 'Password must be at least 8 characters and contain at least one uppercase letter',
  })
  newPassword: string
}
