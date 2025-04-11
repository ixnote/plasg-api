import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/interfaces/user.interface';
import { SendEmailForContact } from '../mda/dtos/send-email-for-contact.dto';
import { Mda } from '../mda/interfaces/mda.interface';
// import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendLoginEmail(user: User) {
    const { email, full_name } = user;

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Login notification',
        template: 'login',
        context: {
          name: full_name,
          email,
        },
      })
      .catch((err) => {
        console.error('Error sending login email:', err);
      });
  }

  async sendContactUsEmail(body: SendEmailForContact, mda: Mda) {
    const { name, email, phone, message, subject } = body;

    const date = new Date().toLocaleDateString();
    this.mailerService
      .sendMail({
        to: mda.contact.email,
        subject: 'New message from Contact us form',
        template: 'contact',
        context: {
          mdaName: mda.name,
          email,
          subject,
          name,
          phone,
          message,
          date,
        },
      })
      .catch((err) => {
        console.error('Error sending contact us email:', err);
      });
  }

  async sendResetPasswordEmail(user: User, token: string) {
    const { email, full_name } = user;
    const url = `example.com/auth/confirm?token=${user}`;

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Reset your password',
        template: './reset-password',
        context: {
          name: full_name,
          email,
          url,
          otp: token,
        },
      })
      .catch((err) => {
        console.error('Error sending reset password email:', err);
      });
  }

  async updatePasswordEmail(user: User, password: string) {
    const { email, full_name } = user;

    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Password updated sucessfully',
        template: './update-password',
        context: {
          name: full_name,
          email,
          password,
        },
      })
      .catch((err) => {
        console.error('Error sending reset password email:', err);
      });
  }
}
