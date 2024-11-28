import { join_room_schema } from '@/lib/dto/chat.dto';
import type { JwtSignPayload } from '@/lib/jwt/auth.middleware';
import { User } from '@/lib/jwt/user.decorator';
import { Validate } from '@/lib/pipe/validate.decorator';
import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('room')
  createRoom(@User() user: JwtSignPayload) {
    return this.chatService.createRoom(user.id);
  }

  @Get('room')
  getRooms(@User() user: JwtSignPayload) {
    return this.chatService.getRooms(user.id);
  }

  @Patch('room/:room_id/join')
  joinRoom(
    @User() user: JwtSignPayload,
    @Validate('Param', join_room_schema.shape.room_id, 'room_id') room_id: string,
  ) {
    return this.chatService.joinRoom(room_id, user.id, 'HTTP');
  }
}
