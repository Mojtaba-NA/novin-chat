import type { ENV } from '@/lib/config/env';
import { type CreateMessageDto, type JoinRoomDto, create_message_schema, join_room_schema } from '@/lib/dto/chat.dto';
import type { JWTPayload } from '@/lib/jwt/auth.middleware';
import { Validate } from '@/lib/pipe/validate.decorator';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  type OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import type { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { type AuthSocket, EMIT, SUBSCRIBE } from './chat.type';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayInit {
  constructor(
    private chatService: ChatService,
    private configService: ConfigService<ENV, true>,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use(async (socket: AuthSocket, next) => {
      const token = socket.request.headers.authorization;
      if (!token) {
        return next(new UnauthorizedException());
      }

      try {
        const payload = <JWTPayload>verify(token, this.configService.get('JWT_SECRET'));
        socket.user = payload;
        next();
      } catch {
        return next(new UnauthorizedException());
      }
    });
  }

  @SubscribeMessage(SUBSCRIBE.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() client: AuthSocket,
    @Validate('MsgBody', join_room_schema) data: JoinRoomDto,
  ) {
    await this.chatService.joinRoom(data.room_id, client.user.id, 'WS');
    client.join(data.room_id);
  }

  @SubscribeMessage(SUBSCRIBE.LEAVE_ROOM)
  handleLeaveRoom(@ConnectedSocket() client: AuthSocket, @Validate('MsgBody', join_room_schema) data: JoinRoomDto) {
    client.leave(data.room_id);
  }

  @SubscribeMessage(SUBSCRIBE.CREATE_MESSAGE)
  handleCreateMessage(@Validate('MsgBody', create_message_schema) data: CreateMessageDto) {
    this.server.to(data.room_id).emit(EMIT.NEW_MESSAGE, data.text);
  }
}
