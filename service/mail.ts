import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: "smtp.dondominio.com",
  auth: {
    user: process.env.EMAILADDRESS,
    pass: process.env.PASSEMAIL,
  },
  secure: false,
});

export async function sendAuthEmail(email: string, authCode: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "CODIGO DE VALIDACION",
    html: `<p>Codigo de validacion para acceder a Onversed ${authCode}</p>`,
  };
  return transporter.sendMail(mailData);
}
export async function sendWelcomeEmail(email: string, name: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "¡Ya eres parte de ONVERSED!",
    html: `<h2>WELCOME!</h2>
   <p> Hola ${name},
    Gracias por registrarte en ONVERSED, la plataforma líder en creación de diseños 3D. Estamos emocionados de tenerte a bordo y queremos ayudarte a dar vida a tus ideas.</p>
    <h2>¡Tu cuenta ha sido creada con éxito!</h2>
    <p>Para comenzar, inicia sesión con tu cuenta y descubre las posibilidades que ONVERSED te ofrece tanto para crear diseños como experiencias inmersivas.</p>
    <h2>¡Gracias por elegir ONVERSED!</h2>`,
  };
  return transporter.sendMail(mailData);
}

export async function sendResponseSolicitud(email: string, name: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Confirmación de recepción de solicitud de diseño",
    html: `<h2>¡RECIBIDO!</h2>
   <p> Hola ${name},
   Hemos recibido tu solicitud con éxito. 
   Estamos revisando la información proporcionada y pronto te contactaremos con la fecha de entrega estimada. 
   
   Agradecemos tu confianza en ONVERSED para convertir tu visión en realidad.
   El equipo de ONVERSED</p>`,
  };
  return transporter.sendMail(mailData);
}
export async function confirmContentAndDeliveryDate(
  email: string,
  name: string,
  date: string
) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Confirmación de contenido y fecha de entrega",
    html: `<h2>¡PERFECTO!</h2>
   <p> Hola ${name},
   Hemos revisado todo el contenido que nos proporcionaste y está todo en orden. 
   La fecha de entrega para tu diseño 3D está programada para ${date}. 
   Estamos emocionados de presentarte el resultado final.
   
   Si tienes alguna pregunta o solicitud adicional, no dudes en contactarnos a través de las notificaciones de la plataforma.
   El equipo de ONVERSED</p>`,
  };
  return transporter.sendMail(mailData);
}

export async function faltaDeInfoEmail(
  email: string,
  name: string,
  faltantes: string[]
) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Información adicional requerida para tu diseño 3D",
    html: `<h2>UPSSS!!! </h2>
   <p> Hola ${name},
   Lamentablemente, hemos identificado que falta información necesaria para realizar tu diseño 3D. Necesitamos que nos proporciones lo siguiente:
   ${lista(faltantes)}

   Por favor, envía la información a ¿cómo?
   Gracias por tu colaboración.
   El equipo de ONVERSED</p>`,
  };
  return transporter.sendMail(mailData);
}
function lista(faltantes: string[]) {
  for (let falta of faltantes) return falta;
}

export async function linkValidarDesign(
  email: string,
  name: string,
  link_design: string
) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Diseños listos para tu validación",
    html: `<h2>¡ESTAMOS A UN CLICK!</h2>
   <p> Hola ${name},
   ¡Los diseños 3D de tu proyecto están listos para ser revisados! 
    Puedes acceder a ellos a través del siguiente enlace: ${link_design}
    Una vez revisados solo tienes que validarlos en la plataforma.
    El equipo de ONVERSED
    </p>`,
  };
  return transporter.sendMail(mailData);
}
export async function confirmAndValidateLastArt(
  email: string,
  name: string,
  date: string
) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Confirmación de validación y fecha de entrega de arte final",
    html: `<h2>¡LISTO!</h2>
   <p> Hola ${name},
   ¡Enhorabuena! Hemos recibido tu validación para los diseños 3D. 
    Los artes finales estarán disponibles para su descarga el ${date}. 
    Estamos encantados de haber sido parte de tu proyecto.
    Gracias por confiar en ONVERSED.
    El equipo de ONVERSED
    </p>`,
  };
  return transporter.sendMail(mailData);
}
export async function noConfirmAndChanges(email: string, name: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "REAJUSTANDO...",
    html: `<h2>¡LISTO!</h2>
   <p> Hola ${name},
   Lamentamos saber que los diseños 3D no cumplen completamente con tus expectativas. Estamos aquí para ayudarte y realizar las modificaciones necesarias.
  Por favor, proporciona detalles específicos sobre los cambios que deseas y trabajaremos en ellos de inmediato.
  Gracias por tu comprensión. 
  El equipo de ONVERSED
    </p>`,
  };
  return transporter.sendMail(mailData);
}
export async function agradecimiento(
  email: string,
  name: string,
  indicadores: string
) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "¡Gracias por tu pedido! ",
    html: `<h2>¡GRACIAS!</h2>
   <p> Hola ${name},
   Queremos agradecerte haber elegido ONVERSED. Además de ofrecerte nuestras soluciones, nos enorgullece informarte sobre el impacto ambiental positivo de tu pedido.
   A continuación, te presentamos una tabla de indicadores que muestra la huella que has ahorrado con tu elección:
  ${indicadores}
   Gracias por contribuir a un mundo más sostenible con ONVERSED. 
   El equipo de ONVERSED
    </p>`,
  };
  return transporter.sendMail(mailData);
}
