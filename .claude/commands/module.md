# Create Module Command

Create a new module with all necessary boilerplate files following the project architecture.

## Arguments
- `$ARGUMENTS` - Module name in singular form (e.g., "product", "order", "category")

## Instructions

1. **Parse module name**: Convert `$ARGUMENTS` to proper formats:
   - kebab-case for files: `product` → `product`
   - PascalCase for classes: `product` → `Product`
   - Plural for route: `product` → `products`

2. **Create folder structure**:
   ```
   src/modules/{module}/
   ├── dtos/
   │   └── requests/    (empty, ready for DTOs)
   ├── entities/        (empty, ready for entities)
   ├── repos/
   │   └── {module}.repos.ts
   ├── {module}.controller.ts
   ├── {module}.service.ts
   ├── {module}.route.ts
   └── {module}.error.ts
   ```

3. **Generate files with this content**:

### {module}.error.ts
```typescript
import { ErrorResp } from '@blazjs/common'

export const {Module}Errors = {
  {Module}NotFound: new ErrorResp('error.{module}NotFound', '{Module} not found'),
}
```

### repos/{module}.repos.ts
```typescript
import { AppDataSource } from '@app/app.datasource'
import { TypeOrmRepos } from '@blazjs/datasource'
import { Service } from 'typedi'

@Service()
export class {Module}Repos extends TypeOrmRepos<any> {
  constructor(datasource: AppDataSource) {
    super(Object, datasource) // TODO: Replace with actual entity after creating it
  }
}
```

### {module}.service.ts
```typescript
import { Service } from 'typedi'
import { {Module}Repos } from './repos/{module}.repos'

@Service()
export class {Module}Service {
  constructor(private {module}Repos: {Module}Repos) {}
}
```

### {module}.controller.ts
```typescript
import { Service } from 'typedi'
import { {Module}Service } from './{module}.service'

@Service()
export class {Module}Controller {
  constructor(private {module}Service: {Module}Service) {}
}
```

### {module}.route.ts
```typescript
import { AppAuth } from '@app/app.auth'
import { BaseRoute } from '@blazjs/common'
import { Service } from 'typedi'
import { {Module}Controller } from './{module}.controller'

@Service()
export class {Module}Route extends BaseRoute {
  route = '{modules}' // plural

  constructor(private auth: AppAuth, private {module}Controller: {Module}Controller) {
    super()

    // Public routes

    // Protected routes
    // this.router.use(this.auth.authorize.bind(this.auth))
  }
}
```

4. **Register route** in `src/routes.ts`:
   - Add import: `import { {Module}Route } from '@modules/{modules}/{module}.route'`
   - Add to `routesV1` array: `{Module}Route`

5. **Output summary** of created files and next steps.
