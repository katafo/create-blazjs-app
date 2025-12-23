# Create Migration Command

Create a new TypeORM migration.

## Arguments

- `$ARGUMENTS` - Migration name in PascalCase (e.g., `CreateProductTable`, `AddEmailToUser`)

## Instructions

1. **Run CLI**:
   ```bash
   yarn typeorm migration:create src/migrations/{MigrationName}
   ```

2. **Read generated file** and suggest implementation based on name pattern.

3. **Remind user**:
   - Fill in migration logic
   - Run `yarn build` before migration
   - Migrations run on app start (if `migrationsRun: true`)

## Column Types

| Type | MySQL |
|------|-------|
| `VARCHAR(n)` | Short strings |
| `TEXT` | Long text |
| `INT` | Integer |
| `DECIMAL(p,s)` | Money/precise |
| `TINYINT(1)` | Boolean (0/1) |
| `DATETIME` | Timestamps |
| `JSON` | JSON objects |

## Examples

### Create Table
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    create table Product (
      id        int auto_increment primary key,
      productId varchar(255)                       not null,
      name      varchar(255)                       not null,
      price     decimal(10, 2)                     not null,
      isActive  tinyint(1) default 1               not null,
      createdAt datetime default current_timestamp not null,
      updatedAt datetime default current_timestamp not null on update current_timestamp
    );
  `)
  await queryRunner.query(`create unique index ux_Product__productId on Product (productId);`)
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`drop table Product;`)
}
```

### Add Column
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`alter table User add column email varchar(255) null;`)
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`alter table User drop column email;`)
}
```

### Add Index
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`create unique index ux_User__email on User (email);`)
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`drop index ux_User__email on User;`)
}
```

## Index Naming

- Unique: `ux_{Table}__{column}`
- Non-unique: `ix_{Table}__{column}`
- Foreign key: `fk_{Table}__{ReferencedTable}`
