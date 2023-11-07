/* eslint-disable no-console */
require('dotenv').config()

/*const env = process.env.NODE_ENV // Por ejemplo: 'development', 'production', 'test', etc.
VERIFICANDO VARIABLES DE ENTORNO 
console.log("hola");
console.log(process.env.NODE_ENV);
console.log(process.env.LOCAL_DB_HOST);
console.log(`${env}_DB_HOST`);
console.log(process.env[`${env}_DB_NAME`]);*/

module.exports = {
    DEVELOPMENT: {
        username: process.env.DEVELOPMENT_DB_USER,
        password: process.env.DEVELOPMENT_DB_PASS,
        database: process.env.DEVELOPMENT_DB_NAME,
        host: process.env.DEVELOPMENT_DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            useUTC: true, // para MySQL
        },
        timezone: '+00:00', // Establece la zona horaria para la aplicación en UTC
    },
    TEST: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            useUTC: true, // para MySQL
        },
        timezone: '+00:00', // Establece la zona horaria para la aplicación en UTC
    },
    LOCAL: {
        username: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASS,
        database: process.env.LOCAL_DB_NAME,
        host: process.env.LOCAL_DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            useUTC: true, // para MySQL
        },
        timezone: '+00:00', // Establece la zona horaria para la aplicación en UTC
        logging: console.log,
    },
}
