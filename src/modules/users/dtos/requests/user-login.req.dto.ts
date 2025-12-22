import { DataRequestDTO } from '@blazjs/common'
import { Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export interface UserLoginDTO {
  email: string
  password: string
}

export class UserLoginReqDTO extends DataRequestDTO implements UserLoginDTO {
  @Expose()
  @IsEmail()
  email: string

  @Expose()
  @IsString()
  password: string
}
