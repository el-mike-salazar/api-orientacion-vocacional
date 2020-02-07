const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let respuesta = new Schema({
    idPregunta: {
        type: Schema.Types.ObjectId,
        ref: 'Pregunta',
        require: [true, 'Favor de ingresar la pregunta.']
    },
    idSatisfaccion: {
        type: Schema.Types.ObjectId,
        ref: 'Satisfaccion',
        require: [true, 'Favor de ingresar la satisfacción.']
    }
});

persona.plugin(uniqueValidator, {
    message: 'La respuesta ya existe.'
});

persona.plugin(mongooseHidden, {
    hidden: {
        _id: false
    }
});

module.exports = mongoose.model('Respuesta', respuesta);