/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Persona = require('../../models/persona');
const Respuesta = require('../../models/respuesta');
const Pregunta = require('../../models/pregunta');
const Perfil = require('../../models/perfil');
const Satisfaccion = require('../../models/satisfaccion');
const Plantel = require('../../models/plantel');
const mailer = require('../../libraries/mails');
const Hogan = require('hogan.js');
const fs = require('fs');
const path = require('path');

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
        { $match: { '_id': mongoose.Types.ObjectId(idPersona) } },
        { $replaceRoot: { newRoot: '$aJsnRespuesta' } },
        { $match: { 'idSatisfaccion': mongoose.Types.ObjectId(idSatisfaccion) } },
        { $project: { '_id': 1, 'idPregunta': 1 } }
    ]).then((respuestas) => {

        if (respuestas.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'La persona no cuenta aún con respuestas registradas',
                cont: {
                    respuestas
                }
            });
        }

        Respuesta.populate(respuestas, { path: 'idPregunta', select: '_id strPregunta' }, ).then((resp) => {
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

        if (persona.aJsnRespuesta <= 0) {

            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'La persona aún no cuenta con respuestas, realice primero el cuestionario.',
                cont: {
                    numRespuestas: persona.aJsnRespuesta.length
                }
            });

        }

        Perfil.find().then(async(perfiles) => {

            if (perfiles.length <= 0) {

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
            await Respuesta.populate(persona.aJsnRespuesta, { path: 'idSatisfaccion' }).then((resp) => {
                perfiles.forEach((perfil) => {
                    contador = 0;
                    perfil.arrPregunta.forEach((idPregunta) => {
                        persona.aJsnRespuesta.forEach((respuesta) => {
                            if (respuesta.idPregunta.toString() === idPregunta.toString()) {
                                contador = contador + parseInt(respuesta.idSatisfaccion.strDesc);
                            }
                        });
                    });
                    arrPerfil.push({
                        _id: perfil._id,
                        strPerfil: perfil.strPerfil,
                        strDesc: perfil.strDesc,
                        nmbPuntos: contador
                    });
                });
            });

            arrPerfil.sort((a, b) => b.nmbPuntos - a.nmbPuntos);

            if (!persona.idPrimerPerfil) {
                const template = fs.readFileSync(path.resolve(__dirname, `../../../uploads/templates/index.html`), 'utf-8');
                let compiledTemplate = Hogan.compile(template);
                let mailOptions = {
                    from: 'orientacion.vocacional@utags.edu.mx',
                    to: persona.strCorreo,
                    subject: 'Resultados del Test de Orientanción Vocacional.',

                    html: compiledTemplate.render({ _id: persona._id, strNombre: (persona.strNombre + ' ' + persona.strPrimerApellido + ' ' + persona.strSegundoApellido), strPerfil: arrPerfil[0].strPerfil, strDesc: arrPerfil[0].strDesc })
                };

                mailer.sendMail(mailOptions);

                Persona.findByIdAndUpdate(idPersona, { $set: { idPrimerPerfil: arrPerfil[0]._id } }).then((persona) => {

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

            } else {

                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Resultado de perfiles según su puntuación.',
                    cont: {
                        arrPerfil
                    }
                });

            }

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
    contGral = 0;
    Persona.findById(idPersona).then(async(persona) => {
        let cont = 0;
        await Satisfaccion.find().then((satisfacciones) => {
            satisfacciones.forEach((satisfaccion) => {
                cont = 0;
                contGral = persona.aJsnRespuesta.length;
                persona.aJsnRespuesta.forEach((respuesta) => {
                    if (respuesta.idSatisfaccion.toString() === satisfaccion._id.toString()) {
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
                contGral,
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

app.delete('/resetearTest/:idPersona', (req, res) => {

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

    Persona.findByIdAndUpdate(idPersona, { $set: { aJsnRespuesta: [], idPrimerPerfil: null } }).then((persona) => {

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
            msg: 'El test de la persona se ha reseteado exitosamente.',
            cont: {
                strCorreo: persona.strCorreo
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar resetear la respuesta.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtenerPerfiles', (req, res) => {

    arrPerfil = [];
    Perfil.find().then((perfiles) => {

        if (perfiles.length <= 0) {

            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay perfiles de los cuales sarcar un resultado.',
                cont: {
                    perfiles
                }
            });

        }

        Persona.aggregate([
            { "$group": { _id: "$idPrimerPerfil", count: { $sum: 1 } } }
        ]).sort({ count: 'desc' }).then((personas) => {

            if (personas.length <= 0) {

                return res.status(404).json({
                    ok: false,
                    resp: 404,
                    msg: 'No hay personas de los cuales sarcar un resultado.',
                    cont: {
                        personas
                    }
                });

            }

            cantidad = 0;
            perfiles.forEach(perfil => {
                let per = personas.filter(persona => {
                    if (persona._id) {
                        if (persona._id.toString() === perfil._id.toString()) {
                            cantidad = persona.count;
                            return true;
                        }
                    }

                });

                if (per.length >= 1) {
                    arrPerfil.push({
                        _id: perfil._id,
                        strNombre: perfil.strPerfil,
                        nmbPersonas: cantidad
                    });
                } else {
                    arrPerfil.push({
                        _id: perfil._id,
                        strNombre: perfil.strPerfil,
                        nmbPersonas: 0
                    });
                }

            });

            arrPerfil.sort((a, b) => b.nmbPersonas - a.nmbPersonas);
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Los perfiles se han obtenido existosamente.',
                cont: {
                    arrPerfil
                }
            });

        });


    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar obtener los resultados.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtenerPerfiles/:dteFechaInicio/:dteFechaFin', (req, res) => {

    dteFechaInicio = req.params.dteFechaInicio;
    dteFechaFin = req.params.dteFechaFin;

    if (!dteFechaInicio || !dteFechaFin) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'No se recibió una fecha válida.',
            cont: {
                dteFechaInicio,
                dteFechaFin
            }
        });
    }

    let unixTimeInicial = new Date(dteFechaInicio).getTime();
    let unixTimeFin = new Date(new Date(dteFechaFin).setHours(42, 59, 59)).getTime();

    arrPerfil = [];
    Perfil.find().then((perfiles) => {

        if (perfiles.length <= 0) {

            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay perfiles de los cuales sarcar un resultado.',
                cont: {
                    perfiles
                }
            });

        }
        Persona.aggregate([
            { $match: { created_at: { $gte: new Date(unixTimeInicial), $lt: new Date(unixTimeFin) } } },
            { "$group": { _id: "$idPrimerPerfil", count: { $sum: 1 } } }
        ]).sort({ count: 'desc' }).then((personas) => {

            if (personas.length <= 0) {

                return res.status(404).json({
                    ok: false,
                    resp: 404,
                    msg: 'No hay personas de los cuales sarcar un resultado.',
                    cont: {
                        personas
                    }
                });

            }

            cantidad = 0;
            perfiles.forEach(perfil => {
                let per = personas.filter(persona => {
                    if (persona._id) {
                        if (persona._id.toString() === perfil._id.toString()) {
                            cantidad = persona.count;
                            return true;
                        }
                    }

                });

                if (per.length >= 1) {
                    arrPerfil.push({
                        _id: perfil._id,
                        strNombre: perfil.strPerfil,
                        nmbPersonas: cantidad
                    });
                } else {
                    arrPerfil.push({
                        _id: perfil._id,
                        strNombre: perfil.strPerfil,
                        nmbPersonas: 0
                    });
                }

            });

            arrPerfil.sort((a, b) => b.nmbPersonas - a.nmbPersonas);
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Los perfiles se han obtenido existosamente.',
                cont: {
                    arrPerfil
                }
            });

        }).catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al intentar obtener los resultados.',
                cont: {
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });

        });
    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar obtener los resultados.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

app.get('/obtenerPerfiles/:idPlantel', (req, res) => {

    idPlantel = req.params.idPlantel;

    if (!idPlantel || idPlantel.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El plantel no existe.',
            cont: {
                idPlantel
            }
        });
    }

    let contador = 0;
    arrPerfil = [];
    Plantel.findById(idPlantel).then((plantel) => {

        if (!plantel) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'El plantel no existe.',
                cont: {
                    plantel
                }
            });
        }

        Perfil.find().then((perfiles) => {

            if (perfiles.length <= 0) {

                return res.status(404).json({
                    ok: false,
                    resp: 404,
                    msg: 'No hay perfiles de los cuales sarcar un resultado.',
                    cont: {
                        perfiles
                    }
                });

            }

            Persona.find({ idPreparatoria: idPlantel }, { _id: 1, idPrimerPerfil: 1 }).then((personas) => {

                if (personas.length <= 0) {

                    return res.status(404).json({
                        ok: false,
                        resp: 404,
                        msg: 'No hay personas de los cuales sarcar un resultado.',
                        cont: {
                            personas
                        }
                    });

                }

                perfiles.forEach((perfil) => {
                    contador = 0;
                    personas.forEach((persona) => {
                        if (persona.idPrimerPerfil !== undefined || persona.idPrimerPerfil !== null) {
                            if (perfil._id.toString() === persona.idPrimerPerfil.toString()) {
                                contador = contador + 1;
                            }
                        }
                    });

                    arrPerfil.push({
                        _id: perfil._id,
                        strNombre: perfil.strPerfil,
                        nmbPersonas: contador
                    });

                });

                arrPerfil.sort((a, b) => b.nmbPersonas - a.nmbPersonas);

                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Los perfiles se han obtenido existosamente.',
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
            msg: 'Error al intentar obtener los perfiles.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });

});

module.exports = app;