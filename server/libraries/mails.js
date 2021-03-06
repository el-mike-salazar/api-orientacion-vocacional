// Se utiliza la librería Nodemailer que nos permite el envío de correos.
const nodemailer = require('nodemailer');
const fs = require('fs');


/*
Se realiza una class para que sea más genérico y se puedan utilizar en diferentes apis si es que se requiere.
*/
class Mailer {

    constructor() {
        this.transport = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: { user: 'orientacion.vocacional@utags.edu.mx', pass: 'Noc09999' }
        });
        this.mailOptions = {
            from: '"Orientanción Vocacional" <orientacion.vocacional@utags.edu.mx>'

        };
    }



    sendMail(options) {

        // Opciones que se requieren enviar 
        let mailOptions = {
            ...this.mailOptions,
            ...options
        };

        this.transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    // Do the reading of the original index.html, and kick everything off.

}



module.exports = new Mailer();