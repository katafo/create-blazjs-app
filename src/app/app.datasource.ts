import { TypeOrmDataSource } from '@blazjs/datasource'
import { Service } from 'typedi'
import { AppConfig } from './app.config'
import { logger } from './app.logger'

@Service()
export class AppDataSource extends TypeOrmDataSource {
  constructor(private config: AppConfig) {
    const { masterDB, slavesDB } = config
    const path = config.isProductionNodeEnv() ? 'dist/' : 'src/'
    super(
      {
        type: 'mysql',
        entities: [path + '**/*.entity.{ts,js}'],
        replication: {
          master: masterDB,
          slaves: slavesDB,
        },
        poolSize: 10,
        maxQueryExecutionTime: 1000,
        migrations: [path + 'migrations/*.{ts,js}'],
        migrationsTableName: 'Migration',
        migrationsRun: true,
        migrationsTransactionMode: 'all',
        cache: {
          type: 'ioredis',
          options: config.redis,
        },
      },
      logger,
    )
  }
}
