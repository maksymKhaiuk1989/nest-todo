import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageHandlerModule } from '@src/modules/image-handler/image-handler.module';
import { UserEntity } from '@src/modules/user/entities/user.entity';
import { UserConsumer } from '@src/modules/user/user.processor';
import { UserController } from '@src/modules/user/user.controller';
import { UserEventsListener } from '@src/modules/user/user.events.listener';
import { UserService } from '@src/modules/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({ name: 'user' }),
    ImageHandlerModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserConsumer, UserEventsListener],
  exports: [UserService],
})
export class UserModule {}
