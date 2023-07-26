import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType({
  description: 'The User model',
})
export class User {
  @Field(() => ID, {
    description: 'The id of the user',
  })
  @Prop({
    type: Types.ObjectId,
    auto: true,
  })
  id: string;

  @Field(() => String, {
    description: 'The first name of the user',
  })
  @Prop({
    required: true,
  })
  firstName: string;

  @Field(() => String, {
    description: 'The last name of the user',
  })
  @Prop({
    required: true,
  })
  lastName: string;

  @Field(() => String, {
    description: 'The email of the user',
  })
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
