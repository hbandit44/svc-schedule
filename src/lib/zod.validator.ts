import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedData = this.schema.parse(value);
      return parsedData;
    } catch (error) {
      console.log('what is the error', error)
      throw new BadRequestException('Validation Failed');
    }
  }
}
