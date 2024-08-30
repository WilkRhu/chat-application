/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageService } from '@/message/message.service';
import { UserService } from '@/users/users.service';
import { ChatService } from '@/chat/chat.service';
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
import { ChatParticipantService } from '@/chat_participants/chat_participants.service';
import { CreateChatDto } from '@/chat/dto/crate-chat-dto';

@Injectable()
@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly chatParticipantService: ChatParticipantService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    messageDto: {
      content: string;
      senderId: string;
      chatId?: string;
      senderName: string;
    },
  ) {
    const { content, senderId, chatId, senderName } = messageDto;

    let chat;

    if (chatId) {
      chat = await this.chatService.findOne(chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }
    } else {
      const createChatDto: CreateChatDto = {
        name: `Chat for User: ${senderName}`,
        isGroup: false,
        participants: [senderId],
      };
      chat = await this.chatService.create(createChatDto);
    }

    await this.messageService.create(content, senderId, chat.id);
    this.server.emit('message', {
      chatId: chat.id,
      content,
      senderId,
      senderName,
    });
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    client: Socket,
    @MessageBody() payload: { chatId: string },
  ) {
    this.logger.log('Get messages request received:', payload);
    try {
      const messages = await this.messageService.findOne(payload.chatId);
      this.logger.log('Messages found:', messages);
      client.emit('messages', messages);
    } catch (error) {
      this.logger.error('Error fetching messages:', error);
      client.emit('error', { message: error.message });
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    console.log('New user connected..', client.id);
    client.broadcast.emit('user-joined', {
      message: `New user Joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
