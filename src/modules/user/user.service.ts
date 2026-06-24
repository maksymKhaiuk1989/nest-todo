import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserResponseDto } from '@src/modules/user/dto/user-response.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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

  // @Cron(CronExpression.EVERY_30_SECONDS, {
  //   name: 'test-cron-job',
  //   utcOffset: 0,
  // })
  // testCron() {
  //   this.logger.debug('Cron test job called every 30 seconds');
  // }
}
