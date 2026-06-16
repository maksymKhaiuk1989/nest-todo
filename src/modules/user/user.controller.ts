import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsPublic } from '@src/common/decorators/is-public.decorator';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserService } from '@src/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @IsPublic()
  @Get('profile')
  findByEmail(@Query('email') email: CreateUserDto['email']) {
    console.log(email);
    return this.userService.findByEmail(email);
  }
}
