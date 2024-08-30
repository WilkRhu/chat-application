import { RoleEnum } from '@/enums/role.enum';
import { Status } from '@/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'O nome de usuário do usuário',
    minLength: 5,
    maxLength: 100,
    example: 'john_doe',
  })
  @IsString()
  @Length(5, 100)
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    minLength: 5,
    maximum: 20,
    example: 'john.doe@mail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    minLength: 8,
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Status do usuário padrão ativo',
    example: Status.ACTIVATED,
  })
  status: Status;

  @ApiProperty({
    description: 'Selecionar papel do usuário',
    example: RoleEnum.ADMIN,
  })
  roles: RoleEnum;
}
