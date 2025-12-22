import { RedisCacheService } from '@blazjs/cache'
import { Service } from 'typedi'
import { AppConfig } from './app.config'

@Service()
export class AppCache extends RedisCacheService {
  constructor(config: AppConfig) {
    super(config.redis)
  }
}
