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

let pregunta = new Schema({
    strPregunta: {
        type: String,
        required: [true, 'Favor de ingresar la pregunta.']
    },
    strTipo: {
        type: String,
        required: [true, 'Favor de ingresar el tipo.']
    }
}, schemaOptions);

pregunta.plugin(uniqueValidator, {
    message: 'La pregunta ya existe.'
});

module.exports = mongoose.model('Pregunta', pregunta);