/* jshint esversion: 8 */
require('./config/config');
require('colors');

const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


const https = require('https');
const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/api-orientacion-vocacional.fs.utags.edu.mx/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/api-orientacion-vocacional.fs.utags.edu.mx/cert.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/api-orientacion-vocacional.fs.utags.edu.mx/fullchain.pem")
};


const httpsServer = https.createServer(httpsOptions, app);
//httpsServer.listen(3000, 'api-orientacion-vocacional.fs.utags.edu.mx');


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Habilita CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

// Parse application/json
app.use(bodyParser.json());

// Habilitación de carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Rutas
app.use('/api', require('./routes/index'));

// Conexión a la Base de Datos
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((resp) => {
        console.log('[SERVER]'.yellow, `Base de datos ONLINE en: ${process.env.URLDB}`);
    })
    .catch((err) => {
        console.log('[SERVER]'.yellow, `Conexión Fallida: ${err}`);
    });

// Puerto de Escucha
//const server = app.listen(process.env.PORT, () => {
//    console.log('[SERVER]'.yellow, `Escuchando en puerto: ${process.env.PORT}`);
//});
httpsServer.listen(3000, 'api-orientacion-vocacional.fs.utags.edu.mx');

