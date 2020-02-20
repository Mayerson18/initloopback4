/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEmail } from '../type-schema';
import { HttpErrors } from '@loopback/rest';
const sgMail = require('@sendgrid/mail');
// const TelegramLogger = require('node-telegram-logger');
// const tg = new TelegramLogger(process.env.BOT_TOKEN, process.env.BOT_CHANNEL);

export interface EmailManager {
  sendMail(mailObj: IEmail): any;
}

export class EmailService {
  constructor() { }

  public async sendMail(mailObj: IEmail) {
    const dynamicTemplateData = {
      subject: '',
      token: mailObj.token,
      name: '',
      city: ''
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({ ...mailObj, 'dynamic_template_data': dynamicTemplateData }).then((value: any) => {
      // tg.sendMessage('Correo enviado (' + mailObj.reason + ') a : ' + mailObj.email, 'EMERGENCY');
    }).catch(() => {
      // tg.sendMessage('Error enviando correo (' + mailObj.reason + ') a : ' + mailObj.email, 'EMERGENCY');
      throw new HttpErrors.UnprocessableEntity(`Error in sending E-mail to ${mailObj.to}`);
    });;
  }
}
