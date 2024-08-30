export class CreateChatDto {
  readonly name?: string;
  readonly isGroup?: boolean;
  readonly participants?: string[];
  readonly isActive?: boolean;
}
