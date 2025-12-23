# Create Module Command

Create a new module with all boilerplate files.

## Arguments

- `$ARGUMENTS` - Module name in **singular** form (e.g., `product`, `order`, `category`)

## Naming Convention

| Input | Folder | Route | Classes |
|-------|--------|-------|---------|
| `product` | `src/modules/products/` | `/products` | `Product*` |
| `order` | `src/modules/orders/` | `/orders` | `Order*` |
| `category` | `src/modules/categories/` | `/categories` | `Category*` |

## Instructions

1. **Create folder structure**:
   ```
   src/modules/{modules}/          # plural (e.g., products)
   ├── dtos/requests/              # empty
   ├── entities/                   # empty
   ├── repos/{module}.repos.ts
   ├── {module}.controller.ts
   ├── {module}.service.ts
   ├── {module}.route.ts
   └── {module}.error.ts
   ```

2. **Generate files**:

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
    super(Object, datasource)
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
  route = '{modules}'

  constructor(private auth: AppAuth, private {module}Controller: {Module}Controller) {
    super()

    // Public routes

    // Protected routes
    // this.router.use(this.auth.authorize.bind(this.auth))
  }
}
```

3. **Register route** in `src/routes.ts`:
```typescript
import { {Module}Route } from '@modules/{modules}/{module}.route'

const routesV1: ClassConstructor<BaseRoute>[] = [
  {Module}Route,
]
```

4. **Output**: List created files and next steps.
