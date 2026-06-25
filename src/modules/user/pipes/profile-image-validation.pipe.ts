import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

const MAX_SIZE_MB = 6;
const MAX_SIZE_BYTES = 1024 * 1024 * MAX_SIZE_MB;
const ALLOWED_IMAGE_TYPES = ['jpeg', 'png'];

const _fileType = new RegExp(`image/(${ALLOWED_IMAGE_TYPES.join('|')})`);

export const ProfileImageValidationPipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: _fileType,
    errorMessage: `Only ${ALLOWED_IMAGE_TYPES.join(', ')} images are allowed`,
  })
  .addMaxSizeValidator({
    maxSize: MAX_SIZE_BYTES,
    message: `Image size must be less than ${MAX_SIZE_MB}MB`,
  })
  .build({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
  });
