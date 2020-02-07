const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
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
        require: [true, 'Favor de ingresar una descripción.']
    }
}, schemaOptions);

satisfaccion.plugin(uniqueValidator, {
    message: 'La satisfacción ya existe.'
});

satisfaccion.plugin(mongooseHidden, {
    hidden: {
        _id: false
    }
});

module.exports = mongoose.model('Satisfaccion', satisfaccion);