/* jshint esversion: 8 */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Plantel = require('../../models/plantel');
const Subsistema = require('../../models/subsistema');

app.get('/obtener', (req, res) => {

    Plantel.find().sort({ created_at: 'desc' }).then((planteles) => {

        if (planteles.length <= 0) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'No hay planteles para mostrar.',
                cont: {
                    planteles
                }
            });
        }

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'Los planteles se han consultado exitosamente.',
            cont: {
                planteles
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar los planteles.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });
});

app.get('/obtener/:idPlantel', (req, res) => {

    const idPlantel = req.params.idPlantel;

    if (!idPlantel || idPlantel.length != 24) {
        return res.status(404).json({
            ok: false,
            resp: 404,
            msg: 'El paltel no existe.',
            cont: {
                idPlantel
            }
        });
    }

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

        return res.status(200).json({
            ok: true,
            resp: 200,
            msg: 'El plantel se ha consultado exitosamente.',
            cont: {
                plantel
            }
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al intentar consultar el plantel.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });
});

app.post('/registrar/:idSubsistema', (req, res) => {

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

    Subsistema.findById(idSubsistema).then((subsistema) => {

        if (!subsistema) {
            return res.status(404).json({
                ok: false,
                resp: 404,
                msg: 'El subsistema no existe.',
                cont: {
                    subsistema
                }
            });
        }

        const plantel = new Plantel({
            strNombre: req.body.strNombre
        });
    
        new Plantel(plantel).save().then((plantel) => {
    
            Subsistema.findByIdAndUpdate(idSubsistema, { $push: { arrPlantel: plantel._id}}).then((resp) => {
    
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'El plantel se ha registrado exitosamente.',
                    cont: {
                        plantel
                    }
                });

            }).catch((err) => {

                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al intentar asignar el plantel al subsistema, se tendrá que agregar manualmente.',
                    cont: {
                        error: Object.keys(err).length === 0 ? err.message : err
                    }
                });
    
    
            });
    

    
        }).catch((err) => {
    
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al intentar registrar el plantel.',
                cont: {
                    error: Object.keys(err).length === 0 ? err.message : err
                }
            });
    
        });

    }).catch((err) => {

        return res.status(500).json({
            ok: true,
            resp: 500,
            msg: 'Error al intentar consultar el subsistema.',
            cont: {
                error: Object.keys(err).length === 0 ? err.message : err
            }
        });

    });



});

module.exports = app;