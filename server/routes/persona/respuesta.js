/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Persona = require('../../models/persona');
const Respuesta = require('../../models/respuesta');

// app.get('/obtener/:idPersona', (req, res) => {

//     const idPersona = req.params.idPersona;

//     if (!idPersona || idPersona.length != 24) {
//         return res.status(404).json({
//             ok: false,
//             resp: 404,
//             msg: 'La persona no existe.',
//             cont: {
//                 idPersona
//             }
//         });
//     }

//     Persona.findById(idPersona)
//         .then((persona) => {

//         }).catch((err) => {

//         });

// });

app.get('/obtenerPorSatisfaccion/idPersona/:idSatisfaccion', (req, res) => {

    const idPersona = req.params.idPersona;

    if (!idPersona || idPersona.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La persona no existe.',
            cont: {
                idPersona
            }
        });
    }

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

    Persona.findOne({ _id: idPersona, 'aJsnRespuesta.idSatisfaccion': idSatisfaccion }, { 'aJsnRespuesta.$': 1 })
        .then((persona) => {

        }).catch((err) => {

        });

});

app.post('/registrar/:idPersona', (req, res) => {

    const idPersona = req.params.idPersona;

    if (!idPersona || idPersona.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La persona no existe.',
            cont: {
                idPersona
            }
        });
    }

    const respuesta = new Respuesta({
        idPregunta: req.body.idPregunta,
        idSatisfaccion: req.body.idSatisfaccion
    });

    let err = respuesta.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar registrar la respuesta.',
            cont: {
                err
            }
        });
    }

    Persona.findByIdAndUpdate(idPersona, { $push: { aJsnRespuesta: respuesta } })
        .then((persona) => {

            if (!persona) {
                return res.status(404).json({
                    ok: false,
                    resp: 404,
                    msg: 'La persona no existe.',
                    cont: {
                        persona
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La respuesta se ha registrado exitosamente.',
                cont: {
                    persona
                }
            });

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar registrar la respuesta.',
                cont: {
                    err
                }
            });

        });

});

app.delete('/eliminar/:idPersona/:idRespuesta', (req, res) => {

    const idPersona = req.params.idPersona;

    if (!idPersona || idPersona.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La persona no existe.',
            cont: {
                idPersona
            }
        });
    }

    const idRespuesta = req.params.idRespuesta;

    if (!idRespuesta || idRespuesta.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La respuesta no existe para esta persona.',
            cont: {
                idRespuesta
            }
        });
    }

    Persona.findOneAndUpdate({ _id: idPersona }, { $pull: { aJsnRespuesta: { _id: idRespuesta } } })
        .then((persona) => {

            if (!persona) {
                return res.status(404).json({
                    ok: false,
                    resp: 404,
                    msg: 'La persona no existe.',
                    cont: {
                        persona
                    }
                });
            }

            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La respuesta se ha eliminado exitosamente.',
                cont: {
                    persona
                }
            });

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar eliminar la respuesta.',
                cont: {
                    err: err ? err : err.message
                }
            });

        });

});

module.exports = app;