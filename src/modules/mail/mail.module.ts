import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { env } from 'src/common/config/env.config';
const { SMTP_HOST, SMTP_NAME, SMTP_PASS, SMTP_PORT, SMTP_USER} = env

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        name: SMTP_NAME,
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false, // i need this for sending via Bluehost
        },
      },
    

      // defaults: {
      //   from: `"Spikk" ${process.env.MAIL_USER}`,
      // },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
