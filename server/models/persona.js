/* jshint esversion: 8 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Respuesta = require('../models/respuesta');
const Subsistema = require('../models/subsistema');
let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

let Schema = mongoose.Schema;

let persona = new Schema({

    strNombre: {
        type: String,
        required: [true, 'Favor de ingresa el nombre de la persona.']
    },
    strPrimerApellido: {
        type: String,
        required: [true, 'Favor de ingresar el primer apellido.']
    },
    strSegundoApellido: {
        type: String
    },
    nmbEdad: {
        type: Number,
        required: [true, 'Favor de ingresar la edad.']
    },
    strCorreo: {
        type: String,
        required: [true, 'Favor de ingresar el correo.']
    },
    strTelefono: {
        type: String,
        required: [true, 'Favor de ingresar el teléfono.']
    },
    idPreparatoria: {
        type: Schema.Types.ObjectId,
        ref: 'Plantel',
        required: [true, 'Favor de ingresar un plantel.']
    },
    aJsnRespuesta: [Respuesta.schema]

}, schemaOptions);

persona.plugin(uniqueValidator, {
    message: 'La persona ya existe.'
});

module.exports = mongoose.model('Persona', persona);