import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'First name of the user' })
  @IsNotEmpty()
  firstName: string;

  @Field(() => String, { description: 'Last name of the user' })
  @IsNotEmpty()
  lastName: string;

  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @MinLength(8)
  password: string;
}
