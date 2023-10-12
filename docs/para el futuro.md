
# EN LO QUE QUEDÉ:

"
Actúa como un experto en desarrollo de software con expressJS.

Realiza un implementación para modificar el endpoint get para que devuelva datos paginados y que se puedan filtrar por nombre en el siguiente controlador, servicio y repository.

Utiliza las mejores practicas, patrones y tecnicas de software."


### OJO CON EL CAMPO ACTIVO: verificar el borrado logico (no dejar loguear a un usuario con el campo activo en false, y ver de implementar metodos para el borrado logico)




### LO QUE LE DIJE A GUZMAN:
- errores manejo y servicio nuevo
- url entorno
- fetchs

---
---

# Tareas
 
## Pendientes

- Documentar con comentarios.

- **Test automatizados**: Realizar casos más completos. se puedesn hacer test con diferentes tokens y diferentes roles

- Implementar manejo de error `404`.

- En `usuario routes`, cambiar por una regex de contraseña más segura.

- Usa helmet para proteger tu aplicación de algunas vulnerabilidades web conocidas.

- Usa express-rate-limit para limitar las solicitudes repetidas a la API y proteger contra ataques de fuerza bruta.

- Ver porque no anda el undo migrations
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
- Ejecutar con `node --watch`. ✅
- Utilizar scripts del `package.json`. ✅
- ¿Añadimos imágenes? ✅
- Ojo con los try-catch en mesaService. Hay que hacer como en el caso de los users que los errores se atrapan en el controller.  ✅
- **Migrar a Sequelize**: Usar Sequelize en lugar de SQL puro en los servicios. ✅
- DOCUMENTAR UN POCO LAS MIGRATIONS Y SUS COMANDOS ✅