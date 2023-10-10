npm run migrate:local : ejecutar las migraciones en el entorno local

npm run undoMigrations:local : deshacer las migraciones en el entorno local

npm run test: ejecutar test y cobertura

npm run format:check: chequeo de formato por prettier

npm run format:write: ajustes de formato por prettier

npm run lint:check: chequeo de errores por eslint

npm run lint:fix: ajuste de errores por eslint

npx sequelize-cli migration:generate --name create-nombreDelModelo: Crear migration

docker-compose -f docker-compose.dev.yml run backend npm run seed:development: poblar con datos la bd del contenedor