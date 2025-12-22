import { Expose } from 'class-transformer'

export class UserDTO {
  @Expose()
  userId: string

  @Expose()
  email: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
