import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { z } from 'zod';

export type Connection = 'HTTP' | 'WS';

export const formatErrors = (error: z.ZodError) =>
  error.errors.map((err) => (err.path.length ? `${err.path.join('.')}: ${err.message}` : err.message));

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: z.ZodTypeAny,
    private connection: Connection = 'HTTP',
  ) {}

  async transform(value: any) {
    const res = await this.schema.safeParseAsync(value);

    if (!res.success) {
      const error = formatErrors(res.error);
      const message = error[0] === 'Required' ? 'Empty body' : error;

      if (this.connection === 'WS') {
        throw new WsException(message);
      }

      throw new BadRequestException(message);
    }

    return res.data;
  }
}
