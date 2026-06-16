import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
  'passwordConfirm',
] as const) {
  id: string;
}
