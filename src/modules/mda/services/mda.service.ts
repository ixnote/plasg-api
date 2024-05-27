import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mda } from '../interfaces/mda.interface';
import { Model } from 'mongoose';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import { CreateMdaDto } from '../dtos/create-mda.dto';
import { AssignMdaDto } from '../dtos/assign-mda.dto';
import { User } from 'src/modules/user/interfaces/user.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { RemoveMdaDto } from '../dtos/remove-mda.dto';

@Injectable()
export class MdaService {
  constructor(
    @InjectModel('Mda') private readonly mdaModel: Model<Mda>,
    private mongooseService: MongooseService,
    private userService: UserService,
  ) {}

  async create(body: CreateMdaDto): Promise<Mda> {
    const createdMda = new this.mdaModel(body);
    return createdMda.save();
  }

  async findAll(): Promise<Mda[]> {
    return this.mdaModel.find().exec();
  }

  async findById(id: string): Promise<Mda> {
    return this.mdaModel.findById(id);
  }

  async findByName(name: string): Promise<Mda> {
    return this.mdaModel.findOne({ name }).exec();
  }

  async findByUser(admin: string): Promise<Mda> {
    return this.mdaModel.findOne({ admin }).exec();
  }
  async createMda(body: CreateMdaDto): Promise<Mda> {
    return await this.create(body);
  }

  async getMdas(): Promise<Mda[]>{
    return await this.mdaModel.find().select('name admin').populate('admin', 'full_name email phone');
  }

  async assignAdminToMda(body: AssignMdaDto): Promise<string> {
    const { admin, mda } = body;
    const user: User = await this.userService.findById(admin);
    if (!user)
      throw new NotFoundException({
        status: false,
        message: 'User not found!',
      });
    const findMda: Mda = await this.findById(mda);
    if (!findMda)
      throw new NotFoundException({
        status: false,
        message: 'Mda not found!',
      });
    if (findMda?.admin)
      throw new UnauthorizedException({
        status: false,
        message: 'This Mda already has an admin',
      });
    await this.mdaModel.findByIdAndUpdate(mda, {
      admin,
    });
    const findIfUserIsConnectedToMda = await this.mdaModel.findOne({
      user: user.id
    })
    if(findIfUserIsConnectedToMda) throw new BadRequestException({
      status: false,
      message: "User currently handles an Mda"
    })
    return 'Mda assigned successfully.';
  }

  async removeUserFromMda(body: RemoveMdaDto): Promise<string> {
    await this.mdaModel.findByIdAndUpdate(body.mda, {
      admin: null,
    });
    return 'Admin unassigned successfully.';
  }
}
