import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import { LoggedUserOutput } from './dto/logged-user.output';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Request } from 'express';

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
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Args('skip', { type: () => Number, nullable: true })
    skip?: number,
    @Args('take', { type: () => Number, nullable: true })
    take?: number,
  ) {
    return this.usersService.findAll({ skip, take });
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => Number, { name: 'usersCount' })
  @UseGuards(JwtAuthGuard)
  getCount() {
    return this.usersService.getCount();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }

  @Subscription(() => User)
  @UseGuards(JwtAuthGuard)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }

  @Mutation(() => LoggedUserOutput)
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context('req') req: Request,
  ) {
    const { accessToken } = await this.usersService.loginUser(loginUserInput);
    req.res?.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return { accessToken };
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getLoggedUser(@Context('req') req: Request) {
    const { userId } = req.user as { userId: string };
    return this.usersService.findOne(userId);
  }
}
