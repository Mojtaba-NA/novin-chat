import { Body, Param, Query } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import type { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

const options = {
  Query: Query,
  Body: Body,
  Param: Param,
  MsgBody: MessageBody,
} as const;

export const Validate = <T extends keyof typeof options>(type: T, schema: z.ZodTypeAny, property?: string) => {
  const connection = type === 'MsgBody' ? 'WS' : 'HTTP';
  if (property === undefined) {
    return options[type](new ZodValidationPipe(schema, connection));
  }

  return options[type](property, new ZodValidationPipe(schema, connection));
};
