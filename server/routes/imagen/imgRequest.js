/* jshint esversion: 8 */
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

app.get('/obtener/:ruta/:img', (req, res) => {
    let ruta = req.params.ruta;
    let img = req.params.img;
    let pathImgen = path.resolve(__dirname, `../../../uploads/${ruta}/${img}`);
    let noImagePath = path.resolve(__dirname, '../../assets/img/no-image.jpg');

    if (fs.existsSync(pathImgen)) {
        return res.sendFile(pathImgen);
    } else {
        return res.sendFile(noImagePath);
    }
});

module.exports = app;