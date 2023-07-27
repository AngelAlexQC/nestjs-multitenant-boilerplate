import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
@InputType()
export class LoginUserInput {
  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @MinLength(8)
  password: string;
}
