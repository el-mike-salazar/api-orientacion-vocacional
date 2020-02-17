/* jshint esversion: 8 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
Plantel = require('../models/plantel');

let schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

let Schema = mongoose.Schema;

let subsistema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del subsistema.']
    },
    arrPlantel: [{
        type: mongoose.Types.ObjectId,
        ref: 'Plantel',
        required: [true, 'Favor de ingresar un plantel.']
    }]
});

subsistema.plugin(uniqueValidator, {
    message: 'El subsistema ya existe.'
});

module.exports = mongoose.model('Subsistema', subsistema);
