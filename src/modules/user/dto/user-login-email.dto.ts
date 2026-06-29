import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';

export class UserLoginEmailDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
