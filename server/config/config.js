/* jshint esversion: 8 */

//Importaciones de middlewares

// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = "mongodb://madmin:d3%40m0nSl%40y3r@172.17.1.4:27017/orientacion-vocacional?authSource=admin";
} else {
    process.env.URLDB = "mongodb://madmin:d3%40m0nSl%40y3r@172.17.1.4:27017/orientacion-vocacional?authSource=admin";
}

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '3h';

// SEED de Autenticación
process.env.SEED = process.env.SEED || '6~+aA^?r{E,[<aK;;/^-E$&)y9_M';

// Declaración de array de middleweres a usar en las APIS
process.middlewares = [];