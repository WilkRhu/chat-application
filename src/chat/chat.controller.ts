import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.chatService.findOne(uuid);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Post(':id/close')
  async closeChat(@Param('id') id: string): Promise<void> {
    await this.chatService.closeChat(id);
  }
}
