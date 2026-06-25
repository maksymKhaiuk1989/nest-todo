import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageHandlerService } from '@src/modules/image-handler/image-handler.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({}),
    }),
  ],
  providers: [ImageHandlerService],
  exports: [ImageHandlerService],
})
export class ImageHandlerModule {}
