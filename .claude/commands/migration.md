# Create Migration Command

Create a new TypeORM migration using CLI.

## Arguments

- `$ARGUMENTS` - Migration name in PascalCase
- Examples:
  - `AddProductTable`
  - `AddEmailToUser`
  - `CreateOrderItems`

## Instructions

1. **Parse arguments**:
   - Extract migration name from `$ARGUMENTS`
   - Ensure name is in PascalCase

2. **Run TypeORM CLI** to create migration:
   ```bash
   yarn typeorm migration:create src/migrations/{MigrationName}
   ```

3. **Read the generated migration file** and suggest implementation based on name pattern using raw SQL queries.

4. **Output**:
   - Show created file path
   - Provide implementation suggestion based on migration name
   - Remind user:
     - Fill in the migration logic
     - Run `yarn build` before running migration
     - Migration runs automatically on app start (if `migrationsRun: true`)
     - Or run manually: `yarn typeorm migration:run -d dist/app/app.datasource.js`

## Common Column Types Reference

| Type | MySQL | Usage |
|------|-------|-------|
| `VARCHAR(n)` | Variable string | Short strings |
| `TEXT` | Long text | Long text content |
| `INT` | Integer | Integers |
| `BIGINT` | Large integer | Large integers |
| `DECIMAL(p,s)` | Decimal | Money, precise decimals |
| `TINYINT(1)` | Boolean | True/false (0/1) |
| `DATETIME` | Date and time | Timestamps |
| `DATE` | Date only | Date only |
| `JSON` | JSON | JSON objects |
| `ENUM('a','b')` | Enumerated | Fixed values |

## Example Implementations

**Create Table:**
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProduct1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table Product
      (
        id        int auto_increment primary key,
        productId varchar(255)                       not null,
        name      varchar(255)                       not null,
        price     decimal(10, 2)                     not null,
        isActive  tinyint(1) default 1               not null,
        createdAt DATETIME default CURRENT_TIMESTAMP not null,
        updatedAt DATETIME default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP
      );
    `)

    await queryRunner.query(`create unique index ux_Product__productId on Product (productId);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table Product;`)
  }
}
```

**Add Column:**
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailToUser1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table User add column email varchar(255) null;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table User drop column email;`)
  }
}
```

**Add Index:**
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexEmailToUser1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create unique index ux_User__email on User (email);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop index ux_User__email on User;`)
  }
}
```

**Add Foreign Key:**
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddForeignKeyOrderToUser1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table \`Order\` add column userId int null;`)
    await queryRunner.query(`alter table \`Order\` add constraint fk_Order__User foreign key (userId) references User (id) on delete cascade;`)
    await queryRunner.query(`create index ix_Order__userId on \`Order\` (userId);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table \`Order\` drop foreign key fk_Order__User;`)
    await queryRunner.query(`drop index ix_Order__userId on \`Order\`;`)
    await queryRunner.query(`alter table \`Order\` drop column userId;`)
  }
}
```

## Index Naming Convention

- Unique index: `ux_{Table}__{column}`
- Non-unique index: `ix_{Table}__{column}`
- Foreign key: `fk_{Table}__{ReferencedTable}`
