# BlazJS App

Node.js REST API built with BlazJS framework, Express, TypeORM, and TypeDI.

## Getting Started

```bash
yarn install
cp .env.example .env
yarn start:dev    # Development
yarn start        # Production
```

## Scripts

```bash
yarn start:dev    # Dev with hot reload
yarn build        # Build TypeScript
yarn start        # Production
yarn lint         # Lint code
```

## Migration

```bash
yarn typeorm migration:create src/migrations/${MigrationName}
```

## Working with Claude Code

This project includes Claude Code commands to speed up development. Use these slash commands in Claude Code chat:

### Available Commands

| Command                                  | Description                                            |
| ---------------------------------------- | ------------------------------------------------------ |
| `/module {name}`                         | Create a new feature module with all boilerplate files |
| `/feature {module} {action} [fields...]` | Add endpoint or entity to existing module              |
| `/migration {Name}`                      | Create a new database migration                        |
| `/processor {module} {Name} [--cron]`    | Create queue processor or cron job                     |
| `/test {module}`                         | Generate tests for a module                            |

### Examples

```bash
# Create new module
/module product

# Add login endpoint to user module
/feature user login email:string:IsEmail password:string:IsString

# Add authenticated endpoint
/feature user changePassword oldPassword:string newPassword:string --auth

# Add entity to module
/feature product --entity Product name:string price:decimal isActive:boolean

# Create migration
/migration CreateProductTable

# Create queue processor
/processor product SendNotification

# Create cron job
/processor product CleanupExpired --cron

# Generate tests
/test product
```

### MCP Server (Optional)

To enable Claude Code to query your database directly:

```bash
cp .mcp.json.example .mcp.json
# Edit .mcp.json with your database credentials
# Restart Claude Code
```

## Project Structure

```
src/
├── app/                    # Core setup (auth, cache, config, datasource)
├── modules/{module}/       # Feature modules
│   ├── dtos/requests/      # Request DTOs
│   ├── dtos/{name}.dto.ts  # Response DTOs
│   ├── entities/           # TypeORM entities
│   ├── repos/              # Repositories
│   ├── processors/         # Queue/Cron processors
│   ├── {module}.controller.ts
│   ├── {module}.service.ts
│   ├── {module}.route.ts
│   └── {module}.error.ts
├── migrations/             # TypeORM migrations
└── routes.ts               # Route registration
```
