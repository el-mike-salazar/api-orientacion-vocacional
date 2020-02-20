/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Subsistema = require('../../models/subsistema');

app.get('/obtener', (req, res) => {

    Subsistema.find().then((subsistemas) => {

        if (subsistemas.length <= 0) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontraron subsistemas para mostrar.',
                cont: {
                    subsistemas
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Los subsistemas se han obtenido exitosamente.',
            cont: {
                subsistemas
            }
        });

    }).catch((err) => {
        
        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar obtener los subsistemas.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtener/:idSubsistema', (req, res) => {

    idSubsistema = req.params.idSubsistema;

    if (!idSubsistema || idSubsistema.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El subsistema no existe.',
            cont: {
                idSubsistema
            }
        });
    }

    Subsistema.findOne({_id: idSubsistema}).then((subsistema) => {

        if (!subsistema) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró el subsistema.',
                cont: {
                    subsistema
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El subsistema se ha obtenido exitosamente.',
            cont: {
                subsistema
            }
        });
        
    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar obtener el subsistema.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.post('/registrar', (req, res) => {

    const subsistema = new Subsistema({
        strNombre: req.body.strNombre
    });

    new Subsistema(subsistema).save().then((subsistema) => {

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El subsistema se ha registrado exitosamente.',
            cont: {
                subsistema
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar registrar el subsistema.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.put('/actualizar/:idSubsistema', (req, res) => {

    idSubsistema = req.params.idSubsistema;

    if (!idSubsistema || idSubsistema.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El subsistema no existe.',
            cont: {
                idSubsistema
            }
        });
    }

    const subsistema = new Subsistema({
        _id: idSubsistema,
        strNombre: req.body.strNombre
    });

    let err = subsistema.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar actualizar el subsistema.',
            cont: {
                err
            }
        });
    }

    Subsistema.findByIdAndUpdate(idSubsistema, { $set: subsistema }).then((subsistema) => {

        if (!subsistema) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró el subsistema.',
                cont: {
                    subsistema
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El subsistema se ha actualizado exitosamente.',
            cont: {
                subsistema
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar actualizar el subsistema.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.delete('/eliminar/:idSubsistema', (req, res) => {

});

module.exports = app;