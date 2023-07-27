import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../common/auth/auth.service';
import { LoginUserInput } from './dto/login-user.input';

const saltRounds = 10;

class GetUsersArgs {
  skip?: number;
  take?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    createUserInput.password = bcrypt.hashSync(
      createUserInput.password,
      saltRounds,
    );
    const newUser = new this.userModel(createUserInput);
    return newUser.save();
  }

  async findAll({ skip = 0, take = 25 }: GetUsersArgs): Promise<User[]> {
    return await this.userModel.find().skip(skip).limit(take).exec();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserInput).exec();
  }

  remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getCount(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async loginUser(loginUserInput: LoginUserInput) {
    const user = await this.authService.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (!user) {
      throw new UnauthorizedException(`Email or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }
}
