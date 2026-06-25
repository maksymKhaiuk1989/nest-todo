import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppConfigService } from '@src/modules/app-config/app-config.service';
import { StorageClient } from '@supabase/storage-js';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

export enum ImageBucketPath {
  PROFILES = 'profiles',
  TEMP = 'temp',
}

export interface UploadImageOptions {
  imageName?: string;
  optimize?: boolean;
}

@Injectable()
export class ImageHandlerService {
  private readonly logger = new Logger(ImageHandlerService.name);
  readonly storageClient: StorageClient;
  readonly bucketName: string;

  constructor(readonly config: AppConfigService) {
    this.storageClient = new StorageClient(config.supabase.STORAGE_URL, {
      apiKey: config.supabase.SERVICE_KEY,
      Authorization: `Bearer ${config.supabase.SERVICE_KEY}`,
    });
    this.bucketName = config.supabase.BUCKET_NAME;
  }

  private get bucket() {
    const bucket = this.storageClient.from(this.bucketName);
    return bucket;
  }

  async uploadImage(
    image: Express.Multer.File,
    bucketPath: ImageBucketPath,
    options: UploadImageOptions = { optimize: true },
  ) {
    const name = options.imageName ?? `${Date.now()}___${randomUUID()}`;
    const saveFullPath = `${bucketPath}/${name}`;
    let fileBuffer = image.buffer;

    if (options.optimize) {
      fileBuffer = await this.optimizeImage(image);
    }

    const { data, error } = await this.bucket.upload(saveFullPath, fileBuffer, {
      contentType: image.mimetype,
      upsert: true,
    });

    if (error) {
      this.logger.error(error);
      throw new Error(error.toString());
    }

    return { data };
  }

  async optimizeImage(image: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const rawData = image.buffer?.data || image.buffer || image;
    try {
      const buffer = Buffer.isBuffer(rawData) ? rawData : Buffer.from(rawData);

      if (!buffer || buffer.length === 0) {
        throw new Error('Optimisation failed: Buffer is empty or undefined');
      }

      const output = await sharp(buffer)
        .jpeg({ quality: 80, mozjpeg: true })
        .resize({ width: 200, height: 200, fit: 'cover', position: 'center' })
        .toBuffer();

      return output;
    } catch (error) {
      this.logger.error('Optimisation failed: ', error);
      throw error;
    }
  }

  async deleteImage(path: ImageBucketPath, fileName: string) {
    const { data, error } = await this.bucket.remove([`${path}/${fileName}`]);

    if (error) {
      this.logger.error(error);
      throw new Error(error.toString());
    }

    return { data };
  }

  async cleanUpTempImages(olderThanXHours = 10): Promise<string> {
    const limit = 200;
    let offset = 0;
    let hasMore = true;
    let deletedCount = 0;
    let imagesCount = 0;

    while (hasMore) {
      const { data: files, error: listError } = await this.bucket.list(
        ImageBucketPath.TEMP,
        {
          limit,
          offset,
          sortBy: { column: 'created_at', order: 'asc' },
        },
      );

      if (listError) {
        throw new Error(listError.message);
      }

      if (!files || files.length === 0) {
        hasMore = false;
        break;
      }

      const now = new Date().getTime();
      const olderThanMs = olderThanXHours * 60 * 60 * 1000;
      imagesCount += files.length;

      const filesToDelete = files.filter(
        (file) =>
          now -
            new Date(file.created_at || file.name.split('___')[0]).getTime() >
          olderThanMs,
      );

      if (filesToDelete.length > 0) {
        const { data, error } = await this.bucket.remove(
          filesToDelete.map((f) => `${ImageBucketPath.TEMP}/${f.name}`),
        );

        if (error) {
          this.logger.error(error);
          throw new Error(error.message);
        }

        deletedCount += data?.length || 0;
      }

      if (filesToDelete.length === files.length) {
        offset += limit;
      } else {
        hasMore = false;
      }
    }

    return `Images total: ${imagesCount} / Images Deleted: ${deletedCount}`;
  }

  @Cron(CronExpression.EVERY_12_HOURS, {
    name: 'clear-temp-images',
    utcOffset: 0,
  })
  async clearTempImages() {
    const logger = new Logger('CRON');
    const start = Date.now();
    logger.verbose('Clearing temp images started...');

    try {
      const result = await this.cleanUpTempImages();

      const elapsedTime = (Date.now() - start) / 1000;

      logger.verbose(
        `Temp images cleared: ${result}. Job took: ${elapsedTime.toFixed(2)}s`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Error during cleanup: ${message}`);
    }
  }
}
