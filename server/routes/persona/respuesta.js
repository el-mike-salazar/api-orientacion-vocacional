/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Persona = require('../../models/persona');
const Respuesta = require('../../models/respuesta');
const Pregunta = require('../../models/pregunta');
const Perfil = require('../../models/perfil');
const Satisfaccion = require('../../models/satisfaccion');

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

app.get('/obtenerPorSatisfaccion/:idPersona/:idSatisfaccion', (req, res) => {

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

    Persona.aggregate([
        { $unwind: '$aJsnRespuesta' },
        { $match: { '_id': mongoose.Types.ObjectId(idPersona)} },
        { $replaceRoot: { newRoot: '$aJsnRespuesta' } },
        { $match: { 'idSatisfaccion': mongoose.Types.ObjectId(idSatisfaccion)} },
        { $project: { '_id': 1, 'idPregunta': 1}}
    ]).then((respuestas) => {

        if(respuestas.length <= 0){
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'La persona no cuenta aún con respuestas registradas',
                cont: {
                    respuestas
                }
            });
        }

        Respuesta.populate(respuestas, {path: 'idPregunta', select: '_id strPregunta'},).then((resp) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Las respuestas se ha obtenido exitosamente.',
                cont: {
                    respuestas
                }
            });
        });

    }).catch((err) => {

        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'Error al consultar las respuestas de la persona.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });
        
    });

});

app.get('/obtenerResultado/:idPersona', (req, res) => {

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

    Persona.findById(idPersona).then((persona) => {

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

        if(persona.aJsnRespuesta <= 0){

            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'La persona aún no cuenta con respuestas, realice primero el cuestionario.',
                cont: {
                    numRespuestas: persona.aJsnRespuesta.length
                }
            });

        }

        Perfil.find().then(async (perfiles) => {

            if(perfiles.length <= 0) {

                return res.status(500).json({
                    ok: false,
                    resp: 500,
                    msg: 'No hay perfiles de los cuales sarcar un resultado.',
                    cont: {
                        error: Object.keys(err).length === 0 ? err.message : err
                    }
                });
                
            }

            arrPerfil = [];
            let contador = 0;
            await Respuesta.populate(persona.aJsnRespuesta, {path: 'idSatisfaccion'}).then((resp) => {
                perfiles.forEach((perfil) => {
                    perfil.arrPregunta.forEach((idPregunta)  => {
                        persona.aJsnRespuesta.forEach((respuesta) => {
                            if(respuesta.idPregunta.toString() === idPregunta.toString()){
                                contador = contador +  parseInt(respuesta.idSatisfaccion.strDesc);
                            }
                        });
                    });
                    arrPerfil.push({
                        strPerfil: perfil.strPerfil,
                        strDesc: perfil.strDesc,
                        nmbPuntos: contador
                    })
                })
            });

            arrPerfil.sort(function(a, b){return b.nmbPuntos-a.nmbPuntos});
            
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Resultado de perfiles según su puntuación.',
                cont: {
                    arrPerfil
                }
            });   

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar obtener los perfiles.',
                cont: {
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });

        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar obtener la persona.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

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
                error: Object.keys(err).length === 0 ? err.message : err
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
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });

        });

});

app.get('/contadorRespuestas/:idPersona', (req, res) => {

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
    contadores = [];
    Persona.findById(idPersona).then(async (persona) => {
        let cont = 0;
        await Satisfaccion.find().then((satisfacciones) => {
            satisfacciones.forEach((satisfaccion) => {
                cont = 0;
                persona.aJsnRespuesta.forEach((respuesta) => {
                    if(respuesta.idSatisfaccion.toString() === satisfaccion._id.toString()){
                        cont = cont + 1;
                    }
                });

                contadores.push({
                    _id: satisfaccion._id,
                    strDesc: satisfaccion.strDesc,
                    cont
                });
            });
        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar obtener los contadores.',
                cont: {
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });
            

        });
        
        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Contadores.',
            cont: {
                contadores
            }
        });
        

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar obtener los contadores.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
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
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });

        });

});

module.exports = app;