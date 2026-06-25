import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ImageBucketPath,
  ImageHandlerService,
} from '@src/modules/image-handler/image-handler.service';
import { CreateUserDto } from '@src/modules/user/dto/create-user.dto';
import { UserResponseDto } from '@src/modules/user/dto/user-response.dto';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private users: Repository<UserEntity>,
    @InjectQueue('user') private userQueue: Queue,
    private readonly imageService: ImageHandlerService,
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

  async uploadProfileImage(userId: string, image: Express.Multer.File) {
    await this.userQueue.add('process-image', { userId, image });

    return { message: 'Image upload in progress' };
  }

  async handleUploadProfileImage(image: Express.Multer.File, userId: string) {
    const imageUrl = await this.imageService.uploadImage(
      image,
      ImageBucketPath.PROFILES,
      { imageName: userId, optimize: true },
    );

    const user = await this.users.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.profileImage = imageUrl.data?.path;

    return await this.users.save(user);
  }

  async deleteProfileImage(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const fileName = user.profileImage;

    if (!fileName) {
      throw new BadRequestException('User has no profile image');
    }

    return await this.imageService.deleteImage(
      ImageBucketPath.PROFILES,
      fileName,
    );
  }
}
