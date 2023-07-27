import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import { LoggedUserOutput } from './dto/logged-user.output';
import { LoginUserInput } from './dto/login-user.input';

const pubSub = new PubSub();

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService
      .create(createUserInput)
      .catch((err) => {
        if (err.code === 11000) {
          throw new GraphQLError(
            `Email ${createUserInput.email} already exists`,
          );
        }
      });
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args('skip', { type: () => Number, nullable: true })
    skip?: number,
    @Args('take', { type: () => Number, nullable: true })
    take?: number,
  ) {
    return this.usersService.findAll({ skip, take });
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.find({
      _id: id,
    });
  }

  @Query(() => Number, { name: 'usersCount' })
  getCount() {
    return this.usersService.getCount();
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.updateOne(
      {
        _id: updateUserInput.id,
      },
      updateUserInput,
    );
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove({
      _id: id,
    });
  }

  @Subscription(() => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }

  @Mutation(() => LoggedUserOutput)
  loginUser(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.usersService.loginUser(loginUserInput);
  }
}
