/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Perfil = require('../../models/perfil');

app.get('/obtener', (req, res) => {

    Perfil.find().then((perfiles) => {

        if (perfiles.length <= 0) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontraron perfiles para mostrar.',
                cont: {
                    perfiles
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Los perfiles se han obtenido exitosamente.',
            cont: {
                perfiles
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar obtener los perfiles.',
            cont: {
                err
            }
        });

    });
});

app.get('/obtener/:idPerfil', (req, res) => {

    idPerfil = req.params.idPerfil;

    if (!idPerfil || idPerfil.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El perfil no existe.',
            cont: {
                idPerfil
            }
        });
    }

    Perfil.findOne({ _id: idPerfil }).then((perfil) => {

        if (!perfil) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró el perfil.',
                cont: {
                    perfil
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El perfil se ha obtenido exitosamente.',
            cont: {
                perfil
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar obtener el perfil.',
            cont: {
                err
            }
        });

    });

});

app.post('/registrar', (req, res) => {

    const perfil = new Perfil({
        strPerfil: req.body.strPerfil,
        strSiglas: req.body.strSiglas,
        strDesc: req.body.strDesc
    });

    new Perfil(perfil).save().then((perfil) => {

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El perfil se ha registrado exitosamente.',
            cont: {
                perfil
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar registrar el perfil.',
            cont: {
                err
            }
        });

    });


});

app.put('/actualizar/:idPerfil', (req, res) => {

    idPerfil = req.params.idPerfil;

    if (!idPerfil || idPerfil.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El perfil no existe.',
            cont: {
                idPerfil
            }
        });
    }

    const perfil = new Perfil({
        _id: idPerfil,
        strPerfil: req.body.strPerfil,
        strSiglas: req.body.strSiglas,
        strDesc: req.body.strDesc
    });

    let err = perfil.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar actualizar el perfil.',
            cont: {
                err
            }
        });
    }

    Perfil.findByIdAndUpdate(idPerfil, { $set: perfil }).then((perfil) => {

        if (!perfil) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró el perfil.',
                cont: {
                    perfil
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El perfil se ha actualizado exitosamente.',
            cont: {
                perfil
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar actualizar el perfil.',
            cont: {
                err
            }
        });

    });

});



module.exports = app;