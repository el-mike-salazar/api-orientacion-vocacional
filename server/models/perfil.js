/* jshint esversion: 8 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

let Schema = mongoose.Schema;

let perfil = new Schema({
    strPerfil: {
        type: String,
        required: [true, 'Favor de ingresar el perfil.']
    },
    strSiglas: {
        type: String,
        required: [true, 'Favor de ingresar las siglas.']
    },
    strDesc: {
        type: String,
        required: [true, 'Favor de ingresar la descripción.']
    },
    arrPregunta: [{
        type: mongoose.Types.ObjectId,
        ref: 'Pregunta',
        required:  [true, 'Favor de ingresar una pregunta.']
    }]
});

perfil.plugin(uniqueValidator, {
    message: 'El perfil ya existe.'
});


module.exports = mongoose.model('Perfil', perfil);