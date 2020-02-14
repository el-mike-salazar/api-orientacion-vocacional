/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Satisfaccion = require('../../models/satisfaccion');

app.get('/obtener', (req, res) => {

    Satisfaccion.find().then((satisfacciones) => {

        if (satisfacciones.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay satisfacciones para mostrar.',
                cont: {
                    satisfacciones
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La satisfacciones se han obtenido exitosamente.',
            cont: {
                satisfacciones
            }
        });

    }).catch((err) => {

        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar obtener las satisfacciones.',
            cont: {
                err
            }
        });

    });
});

app.post('/registrar', (req, res) => {

    const satisfaccion = new Satisfaccion({
        strDesc: req.body.strDesc
    });

    new Satisfaccion(satisfaccion).save()
        .then((satisfaccion) => {

            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La satisfacción se ha registrado exitosamente.',
                cont: {
                    satisfaccion
                }
            });

        }).catch((err) => {

            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al intentar registrar la satisfacción.',
                cont: {
                    err
                }
            });

        });
});

app.put('/actualizar/:idSatisfaccion', (req, res) => {

    const idSatisfaccion = req.params.idSatisfaccion;

    if (!idSatisfaccion || idSatisfaccion.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La satisfacción no existe.',
            cont: {
                idSatisfaccion
            }
        });
    }


});

module.exports = app;