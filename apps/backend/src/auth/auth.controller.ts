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
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

class SignInDto {
  @ApiProperty({
    description: 'Username',
    example: 'john',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'changeme',
  })
  password: string;
}

class LoginResponse {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string;
}

class AuthProfile {
  @ApiProperty({
    description: 'User ID',
    example: '5f9d88e5f6b7ea6c1f9d8d8f',
  })
  userId: string;

  @ApiProperty({
    description: 'email',
    example: 'jhon@email.com',
  })
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @ApiOperation({ operationId: 'signIn' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiTags('auth')
  @ApiSecurity('bearer')
  @ApiOperation({ operationId: 'getProfile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile',
    type: AuthProfile,
  })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      userId: req.user.sub,
      email: req.user.email,
    };
  }
}
