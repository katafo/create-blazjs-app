# CLAUDE.md - BlazJS App Guidelines

## Project Overview

Node.js REST API built with **BlazJS framework**, **Express**, **TypeORM**, and **TypeDI**.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: BlazJS (`@blazjs/*`)
- **Database**: MySQL with TypeORM (master-slave)
- **Cache/Queue**: Redis, BullMQ
- **DI**: TypeDI
- **Validation**: class-validator + class-transformer
- **Auth**: JWT with token revocation

## Project Structure

```
src/
├── app/                    # Core setup (auth, cache, config, datasource, logger)
├── modules/{module}/       # Feature modules
│   ├── dtos/requests/      # Request DTOs
│   ├── dtos/{name}.dto.ts  # Response DTOs
│   ├── entities/           # TypeORM entities
│   ├── repos/              # Repositories
│   ├── {module}.controller.ts
│   ├── {module}.service.ts
│   ├── {module}.route.ts
│   └── {module}.error.ts
├── utils/                  # Utilities
├── migrations/             # TypeORM migrations
├── main.ts                 # Bootstrap
└── routes.ts               # Route registration
```

## Path Aliases

```
@app/*      → src/app/*
@modules/*  → src/modules/*
@utils/*    → src/utils/*
@storages/* → src/storages/*
```

## Important: Before Adding Features

**ALWAYS read existing module files before making changes.** Follow the exact patterns in:
- Controller: `@Request(DTO)` decorator pattern
- Service: Method signature with DTO interface
- Route: Public routes before `auth.authorize`, protected routes after
- DTO: `DataRequestDTO` (public) or `AuthRequestDTO` (protected)

## Slash Commands

| Command | When to Use |
|---------|-------------|
| `/module {name}` | Creating a new feature module |
| `/feature {module} {action} [fields...]` | Adding endpoint or entity to existing module |
| `/migration {Name}` | Creating a new database migration |
| `/processor {module} {Name} [--cron]` | Creating queue processor or cron job |
| `/test {module}` | Writing tests for a module |

### Examples

```bash
/module product
/feature user login email:string:IsEmail password:string:IsString
/feature user changePassword oldPassword:string newPassword:string --auth
/feature product --entity Product name:string price:decimal isActive:boolean
/migration CreateProductTable
/processor product SendNotification
/test product
```

## Code Patterns

### Request DTO (Public)
```typescript
import { DataRequestDTO } from '@blazjs/common'
import { Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export interface UserLoginDTO {
  email: string
  password: string
}

export class UserLoginReqDTO extends DataRequestDTO implements UserLoginDTO {
  @Expose()
  @IsEmail()
  email: string

  @Expose()
  @IsString()
  password: string
}
```

### Request DTO (Authenticated)
```typescript
import { AuthRequestDTO } from '@app/auth/auth.request'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export interface UserChangePasswordDTO {
  userId: string
  oldPassword: string
  newPassword: string
}

export class UserChangePasswordReqDTO extends AuthRequestDTO implements UserChangePasswordDTO {
  @Expose()
  @IsString()
  oldPassword: string

  @Expose()
  @IsString()
  newPassword: string
}
```

### Controller
```typescript
@Request(UserLoginReqDTO)
async login(req: UserLoginReqDTO) {
  return this.userService.login(req)
}
```

### Service
```typescript
async login(data: UserLoginDTO) {
  const { email, password } = data
  // Business logic
  return { accessToken, refreshToken }
}
```

### Route
```typescript
// Public routes
this.router.post('/login', this.userController.login.bind(this.userController))

// Auth middleware
this.router.use(this.auth.authorize.bind(this.auth))

// Protected routes
this.router.post('/logout', this.userController.logout.bind(this.userController))
```

### Entity
```typescript
import { AppBaseEntity } from '@app/app.entity'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Product')
@Index('ux_Product__productId', ['productId'], { unique: true })
export class Product extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: string

  @Column()
  name: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number
}
```

### Response DTO
```typescript
import { Expose } from 'class-transformer'

export class UserDTO {
  @Expose()
  userId: string

  @Expose()
  email: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}

// Usage in repository:
return plainToInstance(UserDTO, result, { excludeExtraneousValues: true })
```

### Repository
```typescript
import { AppDataSource } from '@app/app.datasource'
import { DataSourceMode, TypeOrmRepos } from '@blazjs/datasource'
import { plainToInstance } from 'class-transformer'
import { Service } from 'typedi'

@Service()
export class UserRepos extends TypeOrmRepos<User> {
  constructor(datasource: AppDataSource) {
    super(User, datasource)
  }

  async getProfile(data: UserGetProfileDTO, db: DataSourceMode = 'slave') {
    const { userId } = data

    return await this.datasource.query(db, async (manager) => {
      const query = manager
        .createQueryBuilder()
        .select('u.*')
        .from(User, 'u')
        .where('u.userId = :userId', { userId })

      const result = await query.getRawOne()
      return plainToInstance(UserDTO, result, { excludeExtraneousValues: true })
    })
  }
}
```

### Error
```typescript
import { ErrorResp } from '@blazjs/common'

export const UserErrors = {
  UserNotFound: new ErrorResp('error.userNotFound', 'User not found'),
  InvalidCredentials: new ErrorResp('error.invalidCredentials', 'Invalid credentials'),
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-login.req.dto.ts` |
| Classes | PascalCase | `UserLoginReqDTO` |
| Variables | camelCase | `userService` |
| Tables | PascalCase | `User`, `Product` |
| Unique Index | `ux_{Table}__{column}` | `ux_User__email` |
| Non-unique Index | `ix_{Table}__{column}` | `ix_Order__userId` |

## Commands

```bash
yarn start:dev    # Dev with hot reload
yarn build        # Build
yarn start        # Production
yarn lint         # Lint
```
