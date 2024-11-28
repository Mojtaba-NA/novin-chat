import { customAlphabet } from 'nanoid';
import { z } from 'zod';

const new_id = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const room_id_size = 8;
export const create_room_id = () => new_id(room_id_size);
export const join_room_schema = z.object({
  room_id: z.string().min(room_id_size).max(room_id_size),
});

export type JoinRoomDto = z.infer<typeof join_room_schema>;

export const create_message_schema = z.object({
  text: z.string().min(1).max(1000),
  room_id: join_room_schema.shape.room_id,
});

export type CreateMessageDto = z.infer<typeof create_message_schema>;
