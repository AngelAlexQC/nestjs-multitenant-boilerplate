import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { ApiProperty, ApiSecurity, ApiTags } from '@nestjs/swagger';

class SignInDto {
  @ApiProperty({
    description: 'Username',
    example: 'john',
  })
  username: string;

  @ApiProperty({
    description: 'Password',
    example: 'changeme',
  })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiTags('auth')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
