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

let satisfaccion = new Schema({
    strDesc: {
        type: String,
        required: [true, 'Favor de ingresar una descripción.']
    }
}, schemaOptions);

satisfaccion.plugin(uniqueValidator, {
    message: 'La satisfacción ya existe.'
});

module.exports = mongoose.model('Satisfaccion', satisfaccion);