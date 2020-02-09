/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Persona = require('../../models/persona');

app.post('/registrar', (req, res) => {

    const persona = new Persona({
        strNombre: req.body.strNombre,
        strPrimerApellido: req.body.strPrimerApellido,
        strSegundoApellido: req.body.strSegundoApellido,
        nmbEdad: req.body.nmbEdad,
        strCorreo: req.body.strCorreo,
        strTelefono: req.body.strTelefono,
        idPreparatoria: req.body.idPreparatoria
    });

    new Persona(persona).save().then((persona) => {

        res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La persona se ha registrado exitosamente.',
            cont: {
                persona
            }
        });
    }).catch((err) => {

        res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar registrar a la persona.',
            cont: {
                err
            }
        });

    });
});

module.exports = app;