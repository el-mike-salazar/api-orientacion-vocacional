const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
const uniqueValidator = require('mongoose-unique-validator');
const Respuesta = require('../models/respuesta');

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
        require: [true, 'Favor de ingresa el nombre de la persona.']
    },
    strPrimerApellido: {
        type: String,
        require: [true, 'Favor de ingresar el primer apellido.']
    },
    strSegundoApellido: {
        type: String,
        require: [true, 'Favor de ingrear el segundo apellido.']
    },
    nmbEdad: {
        type: Number,
        require: [true, 'Favor de ingresar la edad.']
    },
    strCorreo: {
        type: String,
        require: [true, 'Favor de ingresar el correo.']
    },
    strTelefono: {
        type: String,
        require: [true, 'Favor de ingresar el teléfono.']
    },
    idPreparatoria: {
        type: Schema.Types.ObjectId,
        ref: 'Preparatoria',
        require: [true, 'Favor de ingresar una preparatoria.']
    },
    jsnRespuesta: [Respuesta]
    
}, schemaOptions);

persona.plugin(uniqueValidator, {
    message: 'La persona ya existe.'
});

persona.plugin(mongooseHidden, {
    hidden: {
        _id: false
    }
});

module.exports = mongoose.model('Persona', persona);