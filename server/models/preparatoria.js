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

let preparatoria = new Schema({
    strNombre: {
        type: String,
        require: [true, 'Favor de ingresar el nombre de la preparatoria.']
    },
    strSiglas: {
        type: String,
        require: [true, 'Favor de ingresar las siglas de la preparatoria.']
    }
}, schemaOptions);

preparatoria.plugin(uniqueValidator, {
    message: 'La preparatoria ya existe.'
});

preparatoria.plugin(mongooseHidden, {
    hidden: {
        _id: false
    }
});

module.exports = mongoose.model('Preparatoria', preparatoria);