# Create Test Command

Plan and create tests for a module.

## Arguments

- `$ARGUMENTS` - Module name (e.g., `product`, `user`)

## Instructions

### Phase 1: Analysis

1. **Read module files**:
   - `{module}.service.ts`
   - `{module}.controller.ts`
   - `repos/{module}.repos.ts`
   - `{module}.error.ts`
   - All DTOs

2. **Create test plan** with TodoWrite:
   - Service unit tests
   - Controller unit tests
   - Test cases: happy path, errors, edge cases

3. **Wait for user approval** before implementing.

### Phase 2: Implementation

**Folder**: `src/modules/{modules}/__tests__/`

### Service Test Template

```typescript
import 'reflect-metadata'
import { Container } from 'typedi'
import { {Module}Service } from '../{module}.service'
import { {Module}Repos } from '../repos/{module}.repos'
import { {Module}Errors } from '../{module}.error'

jest.mock('../repos/{module}.repos')

describe('{Module}Service', () => {
  let service: {Module}Service
  let mockRepos: jest.Mocked<{Module}Repos>

  beforeEach(() => {
    Container.reset()
    mockRepos = new {Module}Repos(null as any) as jest.Mocked<{Module}Repos>
    Container.set({Module}Repos, mockRepos)
    service = Container.get({Module}Service)
  })

  describe('{method}', () => {
    it('should return expected result', async () => {
      // Arrange
      // Act
      // Assert
    })

    it('should throw error when not found', async () => {
      await expect(service.{method}(data)).rejects.toEqual({Module}Errors.{Error})
    })
  })
})
```

### Controller Test Template

```typescript
import 'reflect-metadata'
import { Container } from 'typedi'
import { {Module}Controller } from '../{module}.controller'
import { {Module}Service } from '../{module}.service'

jest.mock('../{module}.service')

describe('{Module}Controller', () => {
  let controller: {Module}Controller
  let mockService: jest.Mocked<{Module}Service>

  beforeEach(() => {
    Container.reset()
    mockService = new {Module}Service(null as any) as jest.Mocked<{Module}Service>
    Container.set({Module}Service, mockService)
    controller = Container.get({Module}Controller)
  })

  describe('{endpoint}', () => {
    it('should call service with correct params', async () => {
      // Test delegation
    })
  })
})
```

### Run Tests

```bash
yarn test src/modules/{modules}
```
