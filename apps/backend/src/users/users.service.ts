import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../common/auth/auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { Repository } from './Repository';

const saltRounds = 10;

@Injectable()
export class UsersService extends Repository<UserDocument> {
  constructor(
    @InjectModel(User.name) private entity: Model<UserDocument>,
    private authService: AuthService,
  ) {
    super(entity);
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

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.entity.findOne({ email });
  }
}

export class FindAllArgs {
  skip?: number;
  take?: number;
}
