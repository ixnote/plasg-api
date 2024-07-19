import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../interfaces/user.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { MongooseService } from 'src/common/helpers/mongoose.helper';
import * as argon2 from 'argon2';
import { UserRoles } from 'src/common/constants/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private mongooseService: MongooseService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword: string = await this.hashData(createUserDto?.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async getTotalNumberOfUsers(): Promise<number>{
    const users: User[] = await this.userModel.find()
    return users.length
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({ email })
      .select('-otp -is_deleted -refreshToken -password')
      .exec();
  }

  async findPasswordByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({ email })
      .select('password is_confirmed role')
      .exec();
  }

  async getMdaUsers(): Promise<User[]> {
    return await this.userModel
      .find({ role: UserRoles.MDA })
      .populate('mdas')
      .exec();
  }

  async registerUser(body: CreateUserDto): Promise<User> {
    const user: User = await this.findByEmail(body.email);
    if (user)
      throw new BadRequestException({
        status: false,
        message: 'User already exists',
      });
    return await this.create(body);
  }

  async deleteAccount(id: string): Promise<string> {
    const user: User = await this.userModel.findByIdAndUpdate(id, {
      is_deleted: true,
    });
    if (!user)
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    return 'User deleted successfully';
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-refreshToken -is_confirmed')
      .exec();
  }

  async updateUser(body: {
    userId: string;
    updateUserId: string;
    phone?: string;
    full_name?: string;
    address?: string;
    device_ids?: string[];
  }): Promise<User> {
    const { userId, updateUserId, phone, full_name, address, device_ids } =
      body;
    if (!this.mongooseService.isValidObjectId(updateUserId)) {
      return this.mongooseService.handleError(
        'UserId is an invalid mongoose Id',
        'id',
      );
    }
    const findUser: User = await this.findById(updateUserId);
    if (!findUser)
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    return await this.userModel
      .findByIdAndUpdate(
        updateUserId,
        { phone, full_name, address, device_ids },
        { new: true },
      )
      .select('-refreshToken -is_confirmed -code -otp');
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
