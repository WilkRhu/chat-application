import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    minLength: 5,
    maximum: 20,
    example: 'john.doe@mail.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    minLength: 8,
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly password: string;
}
