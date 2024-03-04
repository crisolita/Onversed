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
export async function sendWelcomeEmail(email: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "Bienvenido a Onversed",
    html: `<p>Eres bienvenido.. </p>`,
  };
  return transporter.sendMail(mailData);
}
