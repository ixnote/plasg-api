import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import * as argon2 from 'argon2';
import * as tagsData from './data/tags.json';
import * as destinationsData from './data/destinations.json';
import * as legislativesData from './data/legislatives.json';
import { UserRoles } from 'src/common/constants/enum';
import { Tag } from '../tag/interfaces/tag.interface';
import { TagService } from '../tag/services/tag.service';
import { MdaService } from '../mda/services/mda.service';
import { StaticsService } from 'src/statics/services/statics.service';
import { Destination } from 'src/statics/interfaces/destination.interface';
import { Legislative } from 'src/statics/interfaces/legislative.interface';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private tagService: TagService,
    private mdaService: MdaService,
    private staticsService: StaticsService
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
      console.log("🚀 ~ SeederService ~ seed ~ subTags:", subTags)
      newTag.sub_tags = subTags
      await newTag.save()

    }

    const destinations = destinationsData;
    for (const destination of destinations) {
      await this.staticsService.updateDestinations(destination)
    }

    const legislatives = legislativesData;
    for (const legislative of legislatives) {
      await this.staticsService.updateLegislatives(legislative)
    }
  }
}