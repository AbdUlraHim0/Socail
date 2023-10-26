import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/shared/serialize.interceptor';
import { CreateUserDto } from './user.dto';
import { UsersService } from './user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards';
import { CurrentUser } from './decorators';
import { User } from '.';

@Controller('auth')
@Serialize(CreateUserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log('debug');

    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
