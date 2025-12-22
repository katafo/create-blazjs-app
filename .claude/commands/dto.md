# Create DTO Command

Create a DTO for request validation or response serialization.

## Arguments

- `$ARGUMENTS` - Format varies by type:
  - **Request DTO**: `{module} {action} {field:type:validators...} [--auth]`
  - **Response DTO**: `{module} {Entity} {field:type...} --response`

## Examples

```bash
# Request DTO (public)
/dto product create name:string:IsString,IsNotEmpty price:number:IsNumber

# Request DTO (authenticated)
/dto product update name:string:IsOptional --auth

# Response DTO
/dto product Product productId:string name:string price:number --response
```

## Instructions

### 1. Parse Arguments

Detect type based on flags:
- `--response` → Response DTO
- `--auth` → Authenticated Request DTO
- Neither → Public Request DTO

---

### 2A. Response DTO (--response)

**File**: `src/modules/{module}/dtos/{entity}.dto.ts`

```typescript
import { Expose } from 'class-transformer'

export class {Entity}DTO {
  @Expose()
  {entity}Id: string

  @Expose()
  field1: type

  @Expose()
  field2: type

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
```

**Naming**:
- Class: `{Entity}DTO` (e.g., `ProductDTO`)
- File: `{entity}.dto.ts` (e.g., `product.dto.ts`)

**Usage**:
```typescript
import { plainToInstance } from 'class-transformer'

const result = plainToInstance(ProductDTO, entity, { excludeExtraneousValues: true })
```

---

### 2B. Request DTO (no --response)

**File**: `src/modules/{module}/dtos/requests/{module}-{action}.req.dto.ts`

#### Public routes (no --auth):
```typescript
import { DataRequestDTO } from '@blazjs/common'
import { Expose } from 'class-transformer'
import { IsString, IsNumber, ... } from 'class-validator'

export interface {Module}{Action}DTO {
  field1: type
  field2: type
}

export class {Module}{Action}ReqDTO extends DataRequestDTO implements {Module}{Action}DTO {
  @Expose()
  @Validator1()
  @Validator2()
  field1: type

  @Expose()
  @Validator1()
  field2: type
}
```

#### Authenticated routes (--auth):
```typescript
import { AuthRequestDTO } from '@app/auth/auth.request'
import { Expose } from 'class-transformer'
import { IsString, IsNumber, ... } from 'class-validator'

export interface {Module}{Action}DTO {
  userId: string
  field1: type
  field2: type
}

export class {Module}{Action}ReqDTO extends AuthRequestDTO implements {Module}{Action}DTO {
  @Expose()
  @Validator1()
  field1: type
}
```

**Naming**:
- Interface: `{Module}{Action}DTO` (e.g., `ProductCreateDTO`)
- Class: `{Module}{Action}ReqDTO` (e.g., `ProductCreateReqDTO`)
- File: `{module}-{action}.req.dto.ts` (e.g., `product-create.req.dto.ts`)

---

## Validator Reference (class-validator)

| Validator | Decorator |
|-----------|-----------|
| `IsString` | `@IsString()` |
| `IsNumber` | `@IsNumber()` |
| `IsInt` | `@IsInt()` |
| `IsEmail` | `@IsEmail()` |
| `IsBoolean` | `@IsBoolean()` |
| `IsOptional` | `@IsOptional()` |
| `IsUUID` | `@IsUUID()` |
| `IsArray` | `@IsArray()` |
| `IsDate` | `@IsDate()` |
| `IsEnum(Enum)` | `@IsEnum(Enum)` |
| `MinLength(n)` | `@MinLength(n)` |
| `MaxLength(n)` | `@MaxLength(n)` |
| `Min(n)` | `@Min(n)` |
| `Max(n)` | `@Max(n)` |
| `IsNotEmpty` | `@IsNotEmpty()` |

---

## Output

- Created file path
- Example usage snippet
