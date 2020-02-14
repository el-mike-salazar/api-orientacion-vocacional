/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Pregunta = require('../../models/pregunta');
const Persona = require('../../models/persona');

app.get('/obtener', (req, res) => {

    Pregunta.find().then((preguntas) => {

        if (preguntas.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay preguntas para mostrar.',
                cont: {
                    preguntas
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Las preguntas se han obtenido exitosamente.',
            cont: {
                preguntas
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar obtener las preguntas.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtener/:idPregunta', (req, res) => {

    idPregunta = req.params.idPregunta;

    if (!idPregunta || idPregunta.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La pregunta no existe.',
            cont: {
                idPregunta
            }
        });
    }

    Pregunta.findOne({ _id: idPregunta }).then((pregunta) => {

        if (!pregunta) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró la pregunta.',
                cont: {
                    pregunta
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La pregunta se ha obtenido exitosamente.',
            cont: {
                pregunta
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar obtener la pregunta.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtenerAleatorio/:idPersona', (req, res) => {

    idPreguntas = [];
    todasPreguntas = [];
    random = 0;
    idPersona = req.params.idPersona;

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

    Persona.aggregate([
        { $unwind: '$aJsnRespuesta' },
        { $match: { '_id': mongoose.Types.ObjectId(idPersona) } },
        { $replaceRoot: { newRoot: '$aJsnRespuesta' } },
        { $project: { 'idPregunta': 1, '_id': 0 } }
    ]).then(async(persona) => {

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

        await Pregunta.find({}, { _id: 1 }).then(preguntas => {

            preguntas.forEach(pregunta => {
                todasPreguntas.push(pregunta._id);
            });

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar consultar las preguntas.',
                cont: {
                    err
                }
            });

        });

        do {
            random = Math.floor(Math.random() * (todasPreguntas.length - 0)) + 0;
            encontrado = false;

            persona.forEach((respuesta) => {
                if (respuesta.idPregunta.toString() === todasPreguntas[random].toString()) {
                    encontrado = true;
                }

                if (process.anterior && persona.length != (todasPreguntas.length - 1)) {
                    if (process.anterior.toString() === todasPreguntas[random].toString()) {
                        encontrado = true;
                    }
                }
            });

        } while (encontrado);


        process.anterior = todasPreguntas[random];

        await Pregunta.findById(todasPreguntas[random]).then((pregunta) => {

            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'La pregunta se ha consultado exitosamente.',
                cont: {
                    pregunta
                }
            });

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar consultar la pregunta.',
                cont: {
                    err
                }
            });

        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar la persona.',
            cont: {
                err
            }
        });


    });

});

app.post('/registrar', (req, res) => {

    const pregunta = new Pregunta({
        strPregunta: req.body.strPregunta,
        idPerfil: req.body.idPerfil
    });

    new Pregunta(pregunta).save().then((pregunta) => {

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La pregunta se ha registrado exitosamente.',
            cont: {
                pregunta
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar registrar el perfil.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.put('/actualizar/:idPregunta', (req, res) => {

    idPregunta = req.params.idPregunta;

    if (!idPregunta || idPregunta.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'La pregunta no existe.',
            cont: {
                idPregunta
            }
        });
    }

    const pregunta = new Pregunta({
        _id: idPregunta,
        strPregunta: req.body.strPregunta,
        idPerfil: req.body.idPerfil
    });

    let err = pregunta.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar actualizar la pregunta.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

    Pregunta.findByIdAndUpdate(idPregunta, { $set: pregunta }).then((pregunta) => {

        if (!pregunta) {
            return res.status(404).json({
                ok: true,
                resp: 404,
                msg: 'No se encontró la pregunta.',
                cont: {
                    pregunta
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La pregunta se ha actualizado exitosamente.',
            cont: {
                pregunta
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar actualizar la pregunta.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });


});

app.delete('/eliminar', (req, res) => {

});

module.exports = app;