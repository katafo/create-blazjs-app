# Create Processor Command

Create a BullMQ job processor (queue worker or cron job).

## Arguments

- `$ARGUMENTS` - Format: `{module} {Name} [--cron]`
- Examples:
  - `user SendEmail` - Regular queue processor
  - `user CleanupExpiredTokens --cron` - Cron job processor

## Instructions

### 1. Parse Arguments

- Extract module name and processor name
- Detect `--cron` flag for cron job processor

---

### 2A. Regular Queue Processor (no --cron)

**File**: `src/modules/{module}/processors/{name}.processor.ts`

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
      queue: {
        name: '{queue-name}',
      },
      logger,
    })
  }

  async process(job: Job): Promise<BulkJob[]> {
    logger.debug(`Processing {name} job`, job.data)

    // TODO: Implement job processing logic

    // Return child jobs to be added to queue, or empty array
    return []
  }
}
```

**Naming**:
- Class: `{Name}JobProcessor` (e.g., `SendEmailJobProcessor`)
- File: `{name}.processor.ts` (e.g., `send-email.processor.ts`)
- Queue name: kebab-case (e.g., `send-email`)

---

### 2B. Cron Job Processor (--cron)

**File**: `src/modules/{module}/processors/{name}-cron.processor.ts`

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
      queue: {
        name: 'cron-{queue-name}',
      },
      logger,
    })
  }

  async process(_job: Job): Promise<BulkJob[]> {
    logger.debug(`Running {name} cron job...`)

    // TODO: Implement cron job logic

    // Return child jobs to be added to queue, or empty array
    return []
  }
}
```

**Naming**:
- Class: `{Name}CronJobProcessor` (e.g., `CleanupExpiredTokensCronJobProcessor`)
- File: `{name}-cron.processor.ts` (e.g., `cleanup-expired-tokens-cron.processor.ts`)
- Queue name: `cron-{kebab-case}` (e.g., `cron-cleanup-expired-tokens`)

---

### 3. Register Processor

Add to `src/app/app.processor.ts`:

**For regular processor:**
```typescript
import { {Name}JobProcessor } from '@modules/{module}/processors/{name}.processor'

// Inside registerJobProcessors():
const {name}Processor = Container.get({Name}JobProcessor)
{name}Processor.spawn()
```

**For cron processor:**
```typescript
import { {Name}CronJobProcessor } from '@modules/{module}/processors/{name}-cron.processor'

// Inside registerJobProcessors():
const {name}CronProcessor = await Container.get({Name}CronJobProcessor).cron({
  pattern: '0 0 * * *', // Adjust cron pattern as needed
})
{name}CronProcessor.spawn()
```

---

## Common Cron Patterns

| Pattern | Description |
|---------|-------------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Every day at midnight |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of month at midnight |
| `*/5 * * * *` | Every 5 minutes |
| `0 9-17 * * 1-5` | Every hour 9AM-5PM, Mon-Fri |

---

## Output

- Created processor file path
- Show registration code to add to `app.processor.ts`
- Remind about cron pattern for cron jobs

## Adding Jobs to Queue

To add jobs from service:

```typescript
import { {Name}JobProcessor } from '@modules/{module}/processors/{name}.processor'

@Service()
export class SomeService {
  constructor(private {name}Processor: {Name}JobProcessor) {}

  async someMethod() {
    await this.{name}Processor.addJob('{job-name}', {
      // job data
    })
  }
}
```
