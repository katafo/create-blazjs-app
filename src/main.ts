import { AppConfig } from '@app/app.config'
import { AppDataSource } from '@app/app.datasource'
import { logger, requestLogger } from '@app/app.logger'
import { registerJobProcessors } from '@app/app.processor'
import { App } from '@blazjs/common'
import { BullQueueRoute } from '@blazjs/queue'
import Container from 'typedi'
import { Routes, RoutesV1 } from './routes'

async function bootstrap() {
  // validate environment variables
  const config = Container.get(AppConfig)
  config.validate()

  // initialize database
  const datasource = Container.get(AppDataSource)
  await datasource.initialize()

  // reconnect to database if connection is lost
  await datasource.reconnect(5000)

  // register job processors
  const jobProcessors = await registerJobProcessors()
  const queueRoute = new BullQueueRoute(jobProcessors, {
    users: { admin: config.queueBoardPassword },
  })

  const app = new App({
    logger,
  })
  // register routes
  app.registerRoutes(Routes, RoutesV1, { routes: [queueRoute] })

  // register middlewares
  app.registerMiddlewares(requestLogger)

  await app.listen(config.port)
}

bootstrap()
