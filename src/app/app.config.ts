import { Config } from '@blazjs/common'
import { Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { Service } from 'typedi'
import { SqlDataSourceConfig } from './configs/db.config'
import { JwtConfig } from './configs/jwt.config'
import { RedisConfig } from './configs/redis.config'

@Service()
export class AppConfig extends Config {
  @ValidateNested()
  jwt: JwtConfig

  @ValidateNested()
  masterDB: SqlDataSourceConfig

  @ValidateNested({ each: true })
  @Type(() => SqlDataSourceConfig)
  slavesDB: SqlDataSourceConfig[]

  @ValidateNested()
  redis: RedisConfig

  @IsString()
  queueBoardPassword: string

  constructor() {
    super()
    const env = process.env
    this.jwt = this.decodeObj(env.JWT)
    this.masterDB = this.decodeObj(env.MASTER_DB)
    this.slavesDB = this.decodeObj(env.SLAVES_DB)
    this.redis = this.decodeObj(env.REDIS)
    this.queueBoardPassword = env.QUEUE_BOARD_PASSWORD || this.queueBoardPassword
  }

  isDevelopmentEnv() {
    return this.appEnv !== 'production'
  }
}
