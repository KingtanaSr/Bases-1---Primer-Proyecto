//Conexión y acceso a la base de datos

const {Pool} = require('pg') 

const pool = new Pool({
    user: 'postgres',
    password: 'jqs280802',
    host: 'localhost',
    port: 5432,
    database: 'proyecto',

});

module.exports = pool;