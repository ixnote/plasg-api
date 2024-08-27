import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  constructor(@InjectModel('Error') private errorModel: Model<Error>) {
    super();
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception thrown', exception);
    const ctx = host.switchToHttp();
    const request: any = ctx.getRequest<Request>();

    let status = 500;
    let message: any = 'Internal Server Error';
    let userMessage: string = message

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      console.log("🚀 ~ ExceptionsLoggerFilter ~ message:", message)
    }
    userMessage = message?.message
    if (message?.message && Array.isArray(message.message)) {
      userMessage = JSON.stringify(message?.message) || ""
  } 

    const error = new this.errorModel({
      statusCode: status,
      path: request.url,
      message: userMessage,
      user: request?.user || null
    });

    await error.save();
    super.catch(exception, host);
  }
}