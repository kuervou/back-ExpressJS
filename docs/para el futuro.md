
# EN LO QUE QUEDÉ:

### Validaciones de usuarios repetidos y esas cosas 

- Validaciones en Capa de Servicio: "Las validaciones de negocios específicas, como comprobar la existencia de una Ciudad, son generalmente mejor manejadas en la capa de servicio."

- Existencia de Referencias: "Como mencionaste, es esencial validar que si se envía un ciudadId, esta ciudad realmente exista en la base de datos antes de asociarla a un Cliente."


### OJO: 

- Forgot password 
- paginados 
- agregar middleware para roles (decodificar el token)

### LO QUE LE DIJE A GUZMAN:
- errores manejo y servicio nuevo
- url entorno
- fetchs

---
---

# Tareas

## Pendientes

- Documentar con comentarios.

- **Test automatizados**: Realizar casos más completos.

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