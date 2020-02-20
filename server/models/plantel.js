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

let plantel = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del plantel.']
    }
}, schemaOptions);

plantel.plugin(uniqueValidator, {
    message: 'El plantel ya existe.'
});

module.exports = mongoose.model('Plantel', plantel);