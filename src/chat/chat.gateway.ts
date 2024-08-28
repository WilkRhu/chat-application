// src/chat/chat.gateway.ts
import { MessageService } from '@/message/message.service';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    @MessageBody()
    payload: { content: string; senderId: string; receiverId: string },
  ) {
    try {
      const message = await this.messageService.createMessage(
        payload.content,
        payload.senderId,
        payload.receiverId,
      );
      this.server.emit('message', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // @SubscribeMessage('getMessages')
  // async handleGetMessages(client: Socket) {
  //   const messages = await this.messageService.getMessages();
  //   client.emit('messages', messages);
  // }
}
