import { BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedData = this.schema.parse(value);
      return parsedData;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Validation Failed');
    }
  }
}
