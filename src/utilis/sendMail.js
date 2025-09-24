import  dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import path from "path";
import fs from "fs";
dotenv.config();

export const sendMail = async (email, subject, text) => {
    const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "accept-invite.html"
  );
  let html = fs.readFileSync(templatePath, "utf8");

  html = html
    .replace("{{ link }}", data.link)
    .replace("{{ title }}", data.title)
    .replace("{{ startDate }}", data.startDate)
    .replace("{{ endDate }}", data.endDate)
    .replace("{{ userName }}", data.userName);

    const transporter = createTransport({
        host: process.env.MAIL_USER,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_from,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email.join(","), // Join multiple user lai ekkai choti mail pathauna lai use gareko
        subject,
        text,

    };

    await transporter.sendMail(mailOptions);

};