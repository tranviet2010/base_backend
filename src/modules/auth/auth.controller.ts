import { GetCurrentUser } from 'src/shares/decorators/get-current-user.decorators';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { ClientRtGuards } from './guards/client-rt.guard';
import { User } from '@sentry/node';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { ClientService } from '../client/client.service';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    // private readonly clientService: ClientService,
  ) {}

  @Get('user/current')
  @UserAuth()
  @ApiOperation({ summary: '[ User ] Get access token info' })
  async currentUser(@UserID() userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @Post('user/login')
  @ApiOperation({ summary: '[ User ] Login with gmail' })
  async userLogin(@Body() loginDto: LoginDto): Promise<ResponseLogin> {
    return this.authService.userLogin(loginDto);
  }

  @Post('user/refresh-access-token')
  @ApiOperation({ summary: '[ User ] Get new Access Token' })
  @UseGuards(ClientRtGuards)
  async userRefreshAccessToken(@GetCurrentUser() user: PayloadRefreshTokenDto): Promise<ResponseRefreshTokenDto> {
    return this.authService.UserGetAccessToken(user);
  }
}
