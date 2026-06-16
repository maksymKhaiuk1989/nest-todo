import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserResponseDto } from '@src/modules/user/dto/user-response.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private users: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const isUserExists = await this.users.find({
      where: { email: user.email },
    });

    if (isUserExists.length > 0) {
      throw new BadRequestException('User with such email already registered');
    }

    return await this.users.save(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.users.findOne({ where: { email } });

    if (!user) return null;

    return user;
  }
}
