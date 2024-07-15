import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import * as argon2 from 'argon2';
import * as tagsData from './data/tags.json';
import * as mdaData from './data/mda.json';
import { UserRoles } from 'src/common/constants/enum';
import { Tag } from '../tag/interfaces/tag.interface';
import { TagService } from '../tag/services/tag.service';
import { MdaService } from '../mda/services/mda.service';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private tagService: TagService,
    private mdaService: MdaService
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
    // for(const item of mdaData){
    //   await this.mdaService.findOneAndUpdate(item)
    // }
    const tags = tagsData;
    for (const tag of tags) {
      const newTag: Tag = await this.tagService.findOneAndUpdate(
        tag.name,
        tag.type,
      );
      let subTags: any[] = []
      for(const item of tag.sub_tags){
        const newSubTag: Tag = await this.tagService.findOneAndUpdate(
          item.name,
          tag.type,
          newTag.id
        );
        subTags.push(newSubTag.id)
        await this.tagService.updateSubTag(newTag.id, newSubTag.name)
      }
      newTag.sub_tags = subTags
      await newTag.save()

    }
  }
}