/* jshint esversion: 8 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let respuesta = new Schema({
    idPregunta: {
        type: Schema.Types.ObjectId,
        ref: 'Pregunta',
        required: [true, 'Favor de ingresar la pregunta.']
    },
    idSatisfaccion: {
        type: Schema.Types.ObjectId,
        ref: 'Satisfaccion',
        required: [true, 'Favor de ingresar la satisfacción.']
    }
});

respuesta.plugin(uniqueValidator, {
    message: 'La respuesta ya existe.'
});

module.exports = mongoose.model('Respuesta', respuesta);