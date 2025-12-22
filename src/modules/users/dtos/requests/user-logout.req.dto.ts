import { AuthRequestDTO } from '@app/auth/auth.request'
import { Expose } from 'class-transformer'
import { IsJWT } from 'class-validator'

export interface UserLogoutDTO {
  accessToken: string
  refreshToken: string
}

export class UserLogoutReqDTO extends AuthRequestDTO implements UserLogoutDTO {
  @Expose()
  @IsJWT()
  refreshToken: string
}
