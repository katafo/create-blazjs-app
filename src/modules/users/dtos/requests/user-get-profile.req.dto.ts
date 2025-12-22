import { AuthRequestDTO } from '@app/auth/auth.request'

export interface UserGetProfileDTO {
  userId: string
}

export class UserGetProfileReqDTO extends AuthRequestDTO implements UserGetProfileDTO {}
