import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/interfaces/user.interface';
// import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}


  async sendLoginEmail(user: User) {
    const { email, full_name } = user;

   this.mailerService.sendMail({
      to: user.email,
      subject: 'Login notification',
      template: 'login',
      context: {
        name: full_name,
        email,
      },
    }).catch((err) => {
      console.error('Error sending login email:', err);
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
