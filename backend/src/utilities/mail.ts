/***** BASE IMPORTS *****/
import nodeMailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/***** UTILITIES *****/
import { log } from "./logging";
import { templates } from "../templates";

/***** CONSTS *****/
import { DEBUG_LEVELS } from "../models/enums";

/***** TYPE DEFINITIONS *****/
type TSendMailProps = {
  to: string;
  subject: string;
  cc?: string;
  bcc?: string;
  text?: string;
  html?: string;
}

/***** COMPONENT START *****/
export class Mailer {
  private SMTP_HOST = process.env.SMTP_HOST;
  private SMTP_PORT = process.env.SMTP_PORT;
  private SMTP_SECURE = process.env.SMTP_SECURE;
  private SMTP_USER = process.env.SMTP_USER;
  private SMTP_PASS = process.env.SMTP_PASS;

  public transporter: nodeMailer.Transporter<SMTPTransport.SentMessageInfo>;
  public templates = templates;

  constructor() {
    this.validateEnv();
    this.transporter = nodeMailer.createTransport({
      host: this.SMTP_HOST,
      port: Number(this.SMTP_PORT),
      secure: this.SMTP_SECURE === "false" ? false : true,
      auth: {
        user: this.SMTP_USER,
        pass: this.SMTP_PASS
      }
    });
  }

  validateEnv() {
    if (!this.SMTP_HOST || !this.SMTP_PORT || !this.SMTP_SECURE) {
      throw new Error("SMTP_HOST, SMTP_PORT, and SMTP_SECURE must be set in the .env file");
    }
  
    if (isNaN(Number(this.SMTP_PORT))) {
      throw new Error("SMTP_PORT must be a number");
    }
  }

  async sendMail(args: TSendMailProps) {
    return await this.transporter
      .sendMail({ from: this.SMTP_USER, ...args })
      .then((info) => {
        log(DEBUG_LEVELS.INFO, `Message sent: ${info.messageId}`);
        return info;
      })
  }

  async verifyConnection() {
    return await this.transporter.verify();
  }
}
