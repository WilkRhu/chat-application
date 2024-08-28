/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageService } from '@/message/message.service';
import { UserService } from '@/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    @MessageBody()
    payload: { content: string; senderId: string; receiverId: string },
  ) {
    this.logger.log('Mensagem recebida:', payload);

    try {
      const sender = await this.userService.findOne(payload.senderId);
      const receiver = await this.userService.findOne(payload.receiverId);

      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found');
      }

      const message = await this.messageService.createMessage(
        payload.content,
        payload.senderId,
        payload.receiverId,
      );

      this.logger.log('Mensagem criada:', message);
      this.server.emit('message', message);
    } catch (error) {
      this.logger.error('Erro ao processar a mensagem:', error);
      if (client.connected) {
        client.emit('error', { message: error.message });
      }
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    client: Socket,
    @MessageBody() payload: { sender: string },
  ) {
    this.logger.log('Solicitação de mensagens recebidas:', payload);
    try {
      const messages = await this.messageService.findMessagesByUserId(
        payload.sender,
      );
      this.logger.log('Mensagens encontradas:', messages);
      client.emit('messages', messages);
    } catch (error) {
      this.logger.error('Erro ao buscar mensagens:', error);
      client.emit('error', { message: error.message });
    }
  }
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
