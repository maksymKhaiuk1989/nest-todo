import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsPublic } from '@src/common/decorators/is-public.decorator';
import { User } from '@src/common/decorators/user.decorator';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { ProfileImageValidationPipe } from '@src/modules/user/pipes/profile-image-validation.pipe';
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
    return this.userService.findByEmail(email);
  }

  @Post('profile/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfileImage(
    @User() user: UserEntity,
    @UploadedFile(ProfileImageValidationPipe) image: Express.Multer.File,
  ) {
    console.log(user);
    return this.userService.uploadProfileImage(user.id, image);
  }

  @Delete('profile/image')
  deleteProfileImage(@User() user: UserEntity) {
    return this.userService.deleteProfileImage(user.id);
  }
}
