Backend/: carpeta principal  
 back-expressJS/: carpeta que contiene la mayoria de archivos del proyecto
config/: Contiene archivos de configuración como la configuración de la base de datos.
coverage/: Contiene archivos autogenerados por Jest al correr los test
docs/: contiene archivos generales con información relevante
migrations/: contiene las migraciones generadas por sequelize
node_modules/: Carpeta donde se guardan todas las dependencias del proyecto.
seeders/:
src/: Carpeta donde se coloca todo el código fuente del proyecto.
**tests**/: Contiene los archivos para el testing
controllers/: Contiene la lógica para manejar las peticiones y respuestas.
middleware/: Contiene funciones de middleware como autenticación, logging, etc.
models/: Define los modelos de datos y la lógica de negocio.
routes/: Define las rutas de la API.
services/: Maneja la lógica de acceso a la base de datos.
webSocket/: Contiene implementacion relevante al servidor websocket
app.js: Archivo principal que inicia el servidor y agrega la configuración básica.
dockerfile: dockerfile del backend
package.json: Define el proyecto y sus dependencias.
.gitignore: Lista de archivos que Git debe ignorar.
mysql-init.scripts: scripts para inicializar bases de datos necesarias
.env: Contiene variables de entorno.
docker.compose.yml: docker compose para levantar contenedores
