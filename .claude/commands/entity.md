# Create Entity Command

Create a new TypeORM entity for a module and generate migration.

## Arguments
- `$ARGUMENTS` - Format: `{module} {EntityName} {field1:type} {field2:type} ...`
- Example: `product Product name:string price:number description:text isActive:boolean`

## Type Mappings
- `string` → `@Column()` with `string` type
- `text` → `@Column('text')`
- `number` → `@Column()` with `number` type
- `int` → `@Column('int')`
- `decimal` → `@Column('decimal', { precision: 10, scale: 2 })`
- `boolean` → `@Column({ default: false })` with `boolean` type
- `date` → `@Column()` with `Date` type
- `datetime` → `@Column('datetime')`
- `json` → `@Column('json')`

## Instructions

1. **Parse arguments**:
   - Extract module name, entity name, and fields
   - Generate unique ID field name: `{entity}Id` (e.g., `productId`)

2. **Create entity file** at `src/modules/{module}/entities/{entity}.entity.ts`:

```typescript
import { AppBaseEntity } from '@app/app.entity'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('{Entity}')
@Index('ux_{Entity}__{entity}Id', ['{entity}Id'], { unique: true })
export class {Entity} extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  {entity}Id: string

  // Generated fields from arguments
  @Column()
  fieldName: type
}
```

3. **Update repository** at `src/modules/{module}/repos/{module}.repos.ts`:
   - Import the new entity
   - Update `TypeOrmRepos<any>` to `TypeOrmRepos<{Entity}>`
   - Update constructor: `super({Entity}, datasource)`

4. **Register entity** in `src/app/app.entity.ts` or entity registration file if exists.

5. **Generate migration**:
   - Run: `yarn typeorm migration:generate src/migrations/{timestamp}-Add{Entity} -d dist/app/app.datasource.js`
   - Or if using TypeORM CLI directly, provide the appropriate command

6. **Create response DTO** at `src/modules/{module}/dtos/{entity}.dto.ts`:

```typescript
import { Expose } from 'class-transformer'

export class {Entity}DTO {
  @Expose()
  {entity}Id: string

  // Expose other fields (excluding sensitive ones)

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
```

7. **Output summary** with:
   - Created files
   - Migration command to run
   - Reminder to review and run migration
