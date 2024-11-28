import { create_room_id } from '@/lib/dto/chat.dto';
import type { Connection } from '@/lib/pipe/zod-validation.pipe';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async joinRoom(room_id: string, user_id: string, conn: Connection) {
    const room = await this.prisma.client.room.findUnique({
      where: { identifier: room_id },
      select: { user_ids: true },
    });

    if (!room) {
      if (conn === 'WS') {
        throw new WsException('Room not found');
      }

      throw new BadRequestException('Room not found');
    }

    if (room.user_ids.includes(user_id)) {
      return;
    }

    await this.prisma.client.room.updateMany({
      where: { identifier: room_id },
      data: { user_ids: { push: user_id } },
    });
  }

  async createRoom(user_id: string) {
    const room_id = create_room_id();
    await this.prisma.client.room.createMany({
      data: { identifier: room_id, user_ids: [user_id] },
    });

    return { message: 'room was created', room_id };
  }

  getRooms(user_id: string) {
    return this.prisma.client.room.findMany({
      where: { user_ids: { has: user_id } },
      select: { identifier: true, created_at: true },
    });
  }
}
