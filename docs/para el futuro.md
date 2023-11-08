
# EN LO QUE QUEDÉ:


PROXIMO:

OJO: los gurises tienen que migrar empleadoLog para el proximo pull del back

debo ver el pagar todo VER DE HACER UN ENDPOINT NUEVO
Lo del borrado logico de ordenes (Fijarme de reflejar todos los cambios que implica)
debo ver las notas

Aumentar el tamaño del blob en el contenedor


HACERLE ACORDAR A GUZMAN DE CATEGORIAS PAGE -1

FRONT:
Verificar el estado en que esta una orden antes de agregarle o quitarle items.
- manejar errores y exitos

Cambiar el orden de las ordenes en home cocina



### LO QUE LE DIJE A GUZMAN:
- errores manejo y servicio nuevo
- url entorno
- fetchs

---
---

# Tareas
 
## Pendientes

- investigar el tema logs

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





Agregar lo de websocket a la edicion de una orden y sus endpoint derivados (Esto incluye tiempo real en pagos)

C
U
D
de ordenes
Addmesa
additem
removemesa
removeitem
si hay un cambio de estado de orden gracias al pago