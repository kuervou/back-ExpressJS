# Tareas

# EN LO QUE QUEDÉ:

Ver porque no anda el undo migrations

DOCUMENTAR UN POCO LAS MIGRATIONS Y SUS COMANDOS:
"
$env:NODE_ENV="LOCAL"; npx sequelize-cli db:migrate
$env:NODE_ENV="LOCAL";sequelize db:migrate:undo:all --config ./config/config.js
npx sequelize-cli migration:generate --name create-log
"


OJO: Agregar hora a movimiento en el diagrama
                    

## Pendientes

- Documentar con comentarios.

- **Test automatizados**: Realizar casos más completos.

- Ejecutar con `node --watch`.

- Implementar manejo de error `404`.

- Utilizar scripts del `package.json`.

- Ojo con los try-catch en mesaService. Hay que hacer como en el caso de los users que los errores se atrapan en el controller. 

- ¿Añadimos imágenes?

- **Migrar a Sequelize**: 
  - Usar Sequelize en lugar de SQL puro en los servicios.
  - **A tener en cuenta**: Sequelize también ofrece hooks (o ganchos) que te permiten ejecutar lógica en diferentes puntos durante el ciclo de vida de un modelo, como antes de guardar un nuevo registro o después de eliminar uno. (Revisar el ejemplo en la encriptación de password).

- En `usuario routes`, cambiar por una regex de contraseña más segura.

---

## Hecho

- Autenticación ✅
- Revisar las migraciones: corrección de la tabla con 'M' mayúsculas ✅
- Crear una especie de modularización para websocket ✅
- Mover la lógica que interactúa con la base de datos a una capa de "servicios" o "repositorios" ✅
- Enviar una respuesta con un código de estado HTTP que indique un error del lado del servidor (por ejemplo, 500) ✅
- **Validadores**: Utilizar bibliotecas como validator o joi para validar las entradas del usuario. Nunca confiar en los datos del cliente ✅
- Sanitización ✅
- Dockerización ✅

