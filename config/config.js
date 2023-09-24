require('dotenv').config()

const mysql = require('mysql2')

const env = process.env.NODE_ENV // Por ejemplo: 'development', 'production', 'test', etc.

/* VERIFICANDO VARIABLES DE ENTORNO 
console.log("hola");
console.log(process.env.NODE_ENV);
console.log(process.env.DEVELOPMENT_DB_HOST);
console.log(`${env}_DB_HOST`);
console.log(process.env[`${env}_DB_HOST`]);
*/

const db = mysql.createConnection({
    host: process.env[`${env}_DB_HOST`],
    user: process.env[`${env}_DB_USER`],
    password: process.env[`${env}_DB_PASS`],
    database: process.env[`${env}_DB_NAME`],
    port: process.env[`${env}_DB_PORT`],
})

db.connect((err) => {
    if (err) throw err
    if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line no-console
        console.log('Conectado a la base de datos')
    }
})

module.exports = {
    db,
    DEVELOPMENT: {
        username: process.env.DEVELOPMENT_DB_USER,
        password: process.env.DEVELOPMENT_DB_PASS,
        database: process.env.DEVELOPMENT_DB_NAME,
        host: process.env.DEVELOPMENT_DB_HOST,
        dialect: 'mysql',
    },
    TEST: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'mysql',
    },
    LOCAL: {
        username: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASS,
        database: process.env.LOCAL_DB_NAME,
        host: process.env.LOCAL_DB_HOST,
        dialect: 'mysql',
    },
}
