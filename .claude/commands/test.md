# Create Test Command

Plan and create tests for a module.

## Arguments
- `$ARGUMENTS` - Module name (e.g., "product", "user")

## Instructions

### Phase 1: Analysis & Planning

1. **Read module files**:
   - `src/modules/{module}/{module}.service.ts`
   - `src/modules/{module}/{module}.controller.ts`
   - `src/modules/{module}/repos/{module}.repos.ts`
   - `src/modules/{module}/{module}.error.ts`
   - All DTOs in `src/modules/{module}/dtos/`

2. **Identify testable functions**:
   - List all public methods in service
   - List all controller endpoints
   - List all repository methods

3. **Create test plan** using TodoWrite:
   - Group by: Unit Tests (Service) → Unit Tests (Controller) → Integration Tests
   - For each function, list:
     - Happy path cases
     - Edge cases
     - Error cases (based on defined errors)
     - Validation cases (based on DTO validators)

4. **Present plan to user** and wait for approval before proceeding.

### Phase 2: Test Implementation

After user approves the plan:

1. **Create test folder structure**:
   ```
   src/modules/{module}/__tests__/
   ├── {module}.service.spec.ts
   ├── {module}.controller.spec.ts
   └── {module}.repos.spec.ts (if needed)
   ```

2. **Generate service tests** (`{module}.service.spec.ts`):

```typescript
import 'reflect-metadata'
import { Container } from 'typedi'
import { {Module}Service } from '../{module}.service'
import { {Module}Repos } from '../repos/{module}.repos'
import { {Module}Errors } from '../{module}.error'

// Mock dependencies
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

  describe('{methodName}', () => {
    it('should {expected behavior}', async () => {
      // Arrange
      // Act
      // Assert
    })

    it('should throw {Error} when {condition}', async () => {
      // Arrange
      // Act & Assert
      await expect(service.{method}(data)).rejects.toEqual({Module}Errors.{Error})
    })
  })
})
```

3. **Generate controller tests** (`{module}.controller.spec.ts`):

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
    it('should call service method with correct params', async () => {
      // Test controller delegates to service correctly
    })
  })
})
```

4. **Update test config** if needed (jest.config.js, package.json scripts)

5. **Run tests** and report results:
   ```bash
   yarn test src/modules/{module}
   ```

### Test Case Templates

**Happy Path:**
- Valid input → Expected output
- All required fields present → Success response

**Error Cases:**
- Entity not found → Throw `{Module}NotFound`
- Invalid credentials → Throw appropriate error
- Duplicate entry → Throw conflict error

**Validation Cases:**
- Missing required field → Validation error
- Invalid email format → Validation error
- Value out of range → Validation error

**Edge Cases:**
- Empty arrays/strings
- Boundary values (min/max)
- Null/undefined handling
