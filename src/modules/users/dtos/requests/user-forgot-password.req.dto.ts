import { DataRequestDTO } from '@blazjs/common'
import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'

export interface UserForgotPasswordDTO {
  email: string
}

export class UserForgotPasswordReqDTO extends DataRequestDTO implements UserForgotPasswordDTO {
  @Expose()
  @IsEmail()
  email: string
}
