/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Persona = require('../../models/persona');

app.get('/obtener', (req, res) => {

    Persona.find().sort({ created_at: 'desc' }).then((personas) => {

        if (personas.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay personas para mostrar.',
                cont: {
                    personas
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La personas se han consultado exitosamente.',
            cont: {
                personas
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar las personas.',
            cont: {
                err
            }
        });

    });
});

app.get('/obtener/:idPersona', (req, res) => {

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

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La persona se ha consultado exitosamente.',
            cont: {
                persona
            }
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

app.get('/obtenerCorreo/:strCorreo', (req, res)  => {

    const strCorreo = req.params.strCorreo;

    if (!strCorreo) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El correo no existe.',
            cont: {
                strCorreo
            }
        });
    }

    Persona.findOne({strCorreo: strCorreo}).then((persona) => {

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
            msg: 'La persona se ha consultado exitosamente.',
            cont: {
                persona
            }
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

    Persona.findOne({ strCorreo: req.body.strCorreo }).then((encontrado) => {

        console.log(encontrado);
        

        if (!encontrado) {

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

                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'La persona se ha registrado exitosamente.',
                    cont: {
                        persona
                    }
                });

            }).catch((err) => {

                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al intentar registrar a la persona.',
                    cont: {
                        err
                    }
                });

            });
        } else {

            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'El correo ya ha sido regitrado.',
                cont: {
                    strCorreo: req.body.strCorreo
                }
            });

        }



    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al consultar a la persona.',
            cont: {
                strCorreo: req.body.strCorreo
            }
        });
    });

});

app.put('/actualizar/:idPersona', (req, res) => {

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

    const persona = new Persona({
        _id: idPersona,
        strNombre: req.body.strNombre,
        strPrimerApellido: req.body.strPrimerApellido,
        strSegundoApellido: req.body.strSegundoApellido,
        nmbEdad: req.body.nmbEdad,
        strCorreo: req.body.strCorreo,
        strTelefono: req.body.strTelefono,
        idPreparatoria: req.body.idPreparatoria
    });

    Persona.findByIdAndUpdate(idPersona, { $set: persona }).then((persona) => {

        if (!persona) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No se encontró a la persona.',
                cont: {
                    persona
                }
            });
        }

        res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La persona se ha actualizado exitosamente.',
            cont: {
                persona
            }
        });

    }).catch((err) => {

        res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar actualizar a la persona.',
            cont: {
                err
            }
        });

    });

});

app.delete('/eliminar/:idPersona', (req, res) => {

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

    Persona.findByIdAndDelete(idPersona).then((persona) => {

        if (!persona) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No se encontró a la persona.',
                cont: {
                    persona
                }
            });
        }

        res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'La persona se ha eliminado exitosamente.',
            cont: {
                persona
            }
        });

    }).catch((err) => {

        res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error al intentar eliminar a la persona.',
            cont: {
                err
            }
        });

    });
});

module.exports = app;