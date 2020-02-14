/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Preparatoria = require('../../models/preparatoria');

app.get('/obtener', (req, res) => {

    Preparatoria.find().sort({ created_at: 'desc' }).then((preparatorias) => {

        if (preparatorias.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay preparatorias para mostrar.',
                cont: {
                    preparatorias
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La preparatorias se han consultado exitosamente.',
            cont: {
                preparatorias
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las preparatorias.',
            cont: {
                err
            }
        });

    });
});

app.get('/obtener/:idPreparatoria', (req, res) => {

    const idPreparatoria = req.params.idPreparatoria;

    if (!idPreparatoria || idPreparatoria.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La preparatoria no existe.',
            cont: {
                idPreparatoria
            }
        });
    }

    Preparatoria.findById(idPreparatoria).then((preparatoria) => {

        if (!preparatoria) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'La preparatoria no existe.',
                cont: {
                    preparatoria
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La preparatoria se ha consultado exitosamente.',
            cont: {
                preparatoria
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar la preparatoria.',
            cont: {
                err
            }
        });

    });
});

app.post('/registrar', (req, res) => {

    const preparatoria = new Preparatoria({
        strNombre: req.body.strNombre,
        strSiglas: req.body.strSiglas
    });

    new Preparatoria(preparatoria).save().then((preparatoria) => {

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La preparatoria se ha registrado exitosamente.',
            cont: {
                preparatoria
            }
        });

    }).catch((err) => {

        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar registrar la preparatoria.',
            cont: {
                err
            }
        });

    });

});

module.exports = app;