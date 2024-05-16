import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import * as argon2 from 'argon2';
import { UserRoles } from 'src/common/constants/enum';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
){}

async seed() {
    // Seed Admin
    const findAdmin: User = await this.userModel.findOne({
      role: UserRoles.SUPER
    })
    if(!findAdmin){
      const admin: User = new this.userModel({
        full_name: "admin",
        email: "admin@gmail.com",
        phone: "09011231234",
        role: UserRoles.SUPER,
        password: await argon2.hash("Testpassword1-"),
        is_confirmed: true
      })
      await admin.save()
      console.log('Database seeded with admin.');
    }
  }
}