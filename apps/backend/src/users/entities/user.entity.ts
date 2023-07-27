import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType({
  description: 'The User model',
})
@Schema({
  timestamps: true,
})
export class User {
  @Field(() => ID, {
    description: 'The id of the user',
  })
  _id: Types.ObjectId;

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
