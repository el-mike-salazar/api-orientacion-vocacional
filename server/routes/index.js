/* jshint esversion: 8 */
const express = require('express');
const app = express();

app.use('/perfil', require('./perfil/perfil'));
app.use('/persona', require('./persona/persona'));
app.use('/pregunta', require('./pregunta/pregunta'));
app.use('/respuesta', require('./persona/respuesta'));
app.use('/preparatoria', require('./preparatoria/preparatoria'));
app.use('/satisfaccion', require('./satisfaccion/satisfaccion'));

module.exports = app;