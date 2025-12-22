import { DataRequestDTO } from '@blazjs/common'
import { IsString } from 'class-validator'
import { Request } from 'express'

export class AuthRequestDTO extends DataRequestDTO {
  @IsString()
  userId: string

  @IsString()
  accessToken: string

  bind(req: Request): void {
    super.bind(req)
    this.userId = req['userId']
    this.accessToken = req['accessToken']
  }
}
