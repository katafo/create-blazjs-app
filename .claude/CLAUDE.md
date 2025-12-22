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

## Slash Commands

**Use these commands instead of manually creating files:**

| Command | When to Use |
|---------|-------------|
| `/module {name}` | Creating a new feature module (creates all boilerplate files) |
| `/entity {module} {Entity} {fields...}` | Adding a new database entity to a module |
| `/dto {module} {action} {fields...}` | Creating request or response DTOs |
| `/migration {Name}` | Creating a new database migration |
| `/processor {module} {Name} [--cron]` | Creating queue processor or cron job |
| `/test {module}` | Writing tests (plans first, then implements) |

### Examples

```bash
# New module
/module product

# New entity with fields
/entity product Product name:string price:decimal isActive:boolean

# Request DTO (public)
/dto product create name:string:IsString,IsNotEmpty price:number:IsNumber

# Request DTO (authenticated)
/dto product update name:string:IsOptional --auth

# Response DTO
/dto product Product productId:string name:string price:number --response

# New migration
/migration CreateProductTable

# Queue processor
/processor product SendNotification

# Cron job processor
/processor product CleanupExpired --cron

# Generate tests
/test product
```

## Code Conventions

### Naming
- **Files**: kebab-case (`user-login.req.dto.ts`)
- **Classes**: PascalCase (`UserLoginReqDTO`)
- **Variables**: camelCase
- **Tables**: PascalCase (`User`, `Product`)
- **Indexes**: `ux_{Table}__{column}` (unique), `ix_{Table}__{column}` (non-unique)

### Patterns
- Request DTOs extend `DataRequestDTO` (public) or `AuthRequestDTO` (protected)
- Response DTOs use `@Expose()` for serialization
- Errors defined in `{module}.error.ts` using `ErrorResp`
- Use `'slave'` for reads, `'master'` for writes
- All entities extend `AppBaseEntity`

## Commands

```bash
yarn start:dev    # Dev with hot reload
yarn build        # Build
yarn start        # Production
yarn lint         # Lint
```

## Environment

See `.env.example`:
- `JWT`: JWT config (JSON)
- `REDIS`: Redis connection (JSON)
- `MASTER_DB` / `SLAVES_DB`: MySQL connections (JSON)
