# Create Processor Command

Create a BullMQ job processor (queue worker or cron job).

## Arguments

- `$ARGUMENTS` - Format: `{module} {Name} [--cron]`
  - `user SendEmail` - Queue processor
  - `user CleanupTokens --cron` - Cron job

## Instructions

### Queue Processor (default)

**File**: `src/modules/{modules}/processors/{name}.processor.ts`

```typescript
import { AppConfig } from '@app/app.config'
import { logger } from '@app/app.logger'
import { BulkJob, JobProcessor } from '@blazjs/queue'
import { Job } from 'bullmq'
import { Service } from 'typedi'

@Service()
export class {Name}JobProcessor extends JobProcessor {
  constructor(config: AppConfig) {
    super({
      connection: config.redis,
      queue: { name: '{queue-name-kebab}' },
      logger,
    })
  }

  async process(job: Job): Promise<BulkJob[]> {
    logger.debug(`Processing job`, job.data)
    // TODO: Implement logic
    return []
  }
}
```

### Cron Processor (--cron)

**File**: `src/modules/{modules}/processors/{name}-cron.processor.ts`

```typescript
import { AppConfig } from '@app/app.config'
import { logger } from '@app/app.logger'
import { BulkJob, CronJobProcessor } from '@blazjs/queue'
import { Job } from 'bullmq'
import { Service } from 'typedi'

@Service()
export class {Name}CronJobProcessor extends CronJobProcessor {
  constructor(config: AppConfig) {
    super({
      connection: config.redis,
      queue: { name: 'cron-{queue-name-kebab}' },
      logger,
    })
  }

  async process(_job: Job): Promise<BulkJob[]> {
    logger.debug(`Running cron job...`)
    // TODO: Implement logic
    return []
  }
}
```

### Register in `src/app/app.processor.ts`

**Queue processor:**
```typescript
const processor = Container.get({Name}JobProcessor)
processor.spawn()
```

**Cron processor:**
```typescript
const cronProcessor = await Container.get({Name}CronJobProcessor).cron({
  pattern: '0 0 * * *', // daily at midnight
})
cronProcessor.spawn()
```

## Cron Patterns

| Pattern | Description |
|---------|-------------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily midnight |
| `*/5 * * * *` | Every 5 minutes |

## Adding Jobs

```typescript
@Service()
export class SomeService {
  constructor(private processor: {Name}JobProcessor) {}

  async doSomething() {
    await this.processor.addJob('job-name', { data })
  }
}
```
