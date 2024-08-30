import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('')
  serachMessage(@Query('chatId') chatId: string) {
    return this.messageService.serachMessage(chatId);
  }
}
