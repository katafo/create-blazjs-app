### How to run:

```
yarn install
cp .env.example .env
yarn start:dev (development)
yarn start (production)
```

### Migration:

```
yarn typeorm migration:create src/migrations/${name}
```
