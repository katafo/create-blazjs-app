import { AppBaseEntity } from '@app/app.entity'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('User')
@Index('ux_User__email', ['email'], { unique: true })
@Index('ux_User__userId', ['userId'], { unique: true })
export class User extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  salt: string
}
