
back-expressJS/: carpeta que contiene la mayoria de archivos del proyecto
    config/: Contiene archivos de configuración como la configuración de la base de datos.
    coverage/: Contiene archivos autogenerados por Jest al correr los test
    docs/: contiene archivos generales con información relevante de como funciona el proyecto
    migrations/: contiene las migraciones generadas por sequelize
    mysql-init-sqcripts/: contiene scripts para inicializar tablas en la bd 
    node_modules/: Carpeta donde se guardan todas las dependencias del proyecto.
    seeders/: Contiene data providers para la bd
    src/: Carpeta donde se coloca todo el código fuente del proyecto.
        **tests**/: Contiene los archivos para el testing
        controllers/: Contiene la lógica para manejar las peticiones y respuestas.
        error-handling/: COntiene lógica para manejo global de errores
        middleware/: Contiene funciones de middleware como autenticación, logging, etc.
        models/: Define los modelos de datos y la lógica de negocio.
        routes/: Define las rutas de la API.
            validations/: Este directorio guarda los esquemas para validar las entradas de datos en las rutas
        services/: Maneja la lógica de acceso a la base de datos.
        webSocket/: Contiene implementacion relevante al servidor websocket
        app.js: Archivo principal que inicia el servidor y agrega la configuración básica.
    .env: Contiene variables de entorno.
    .eslintrc.json: contiene configuración para eslint (checkeo de código)
    .gitignore: archivos a ignorar por git
    .prettierrc.json: contiene configuración de prettier (formateo de codigo)
    docker.compose.dev.yml: docker compose para levantar contenedores en entorno de desarrollo
    dockerfile: dockerfile del backend
    package.json: Define el proyecto y sus dependencias.

   
   
 
