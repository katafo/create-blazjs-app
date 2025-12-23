# Add Feature Command

Add endpoint or entity to an existing module.

## Arguments

- `$ARGUMENTS`:
  - **Endpoint**: `{module} {feature} [fields...] [--auth] [--method=POST|GET|PUT|DELETE]`
  - **Entity**: `{module} --entity {EntityName} {field:type...}`

## Examples

```bash
/feature user login email:string:IsEmail password:string:IsString
/feature user changePassword oldPassword:string newPassword:string --auth
/feature product getById productId:string:IsUUID --method=GET
/feature product --entity Product name:string price:decimal isActive:boolean
```

---

## Step 1: Read Module First

**CRITICAL**: Before making changes, READ existing module files to understand patterns:

- `{module}.controller.ts`
- `{module}.service.ts`
- `{module}.route.ts`
- `{module}.error.ts`
- `dtos/requests/` (existing DTOs)

---

## MODE 1: Add Endpoint

### Common Validators

| Validator | Usage |
|-----------|-------|
| `IsString` | String field |
| `IsNumber` | Number field |
| `IsEmail` | Email format |
| `IsUUID` | UUID format |
| `IsBoolean` | Boolean field |
| `IsOptional` | Optional field |
| `IsNotEmpty` | Required, non-empty |
| `MinLength(n)` | Min string length |
| `MaxLength(n)` | Max string length |
| `Min(n)` | Min number value |
| `Max(n)` | Max number value |

### Create files & edit:

1. **Create Request DTO**: `dtos/requests/{module}-{feature-kebab}.req.dto.ts`

   - Extend `DataRequestDTO` (public) or `AuthRequestDTO` (--auth)
   - See CLAUDE.md for patterns

2. **Ask about Response DTO**:

   > "Do you need a Response DTO for this feature?"

   - If YES → Create `dtos/{feature}.dto.ts`

3. **Edit Controller**: Add method with `@Request(DTO)` decorator

4. **Edit Service**: Add method with business logic

5. **Edit Route**: Add route (public: before auth middleware, protected: after)

6. **Edit Errors** (if needed): Add error responses

---

## MODE 2: Add Entity (--entity flag)

### Type Mappings

| Type       | TypeORM                                           |
| ---------- | ------------------------------------------------- |
| `string`   | `@Column()`                                       |
| `text`     | `@Column('text')`                                 |
| `number`   | `@Column()`                                       |
| `int`      | `@Column('int')`                                  |
| `decimal`  | `@Column('decimal', { precision: 10, scale: 2 })` |
| `boolean`  | `@Column({ default: false })`                     |
| `datetime` | `@Column('datetime')`                             |
| `json`     | `@Column('json')`                                 |

### Create files & edit:

1. **Create Entity**: `entities/{entity}.entity.ts`

   - Extend `AppBaseEntity`
   - Add `{entity}Id` unique column
   - See CLAUDE.md for pattern

2. **Edit Repository**: Update to use new entity

3. **Register Entity**: Add to `src/app/app.entity.ts`

4. **Ask about Response DTO**:

   > "Do you need a Response DTO for {Entity}?"

5. **Remind**: "Run `yarn typeorm migration:create src/migrations/ {MigrationName}` to create migration"

---

## Output

- List created/modified files
- Endpoint path and method (for endpoint mode)
- Example request body
- TODOs for developer
