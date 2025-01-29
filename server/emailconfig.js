// config/emailConfig.js
import nodemailer from 'nodemailer';

// Función para crear el transporte de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.office365.com', // Servidor SMTP (puede variar según tu proveedor)
    port: 587, // Puerto SMTP estándar
    secure: false, // `false` para STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // Usuario (correo electrónico)
      pass: process.env.EMAIL_PASS  // Contraseña del correo
    }
  });
};

export const sendEmail = async ({ to, subject, text, attachments }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Tu Empresa" <${process.env.EMAIL_USER}>`, // Remitente
    to, // Destinatario
    subject, // Asunto
    text, // Cuerpo del mensaje
    attachments // Archivos adjuntos
  };

  // Enviar el correo
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
};
