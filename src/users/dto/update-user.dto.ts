import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, Length } from 'class-validator';
import { Status } from '@/enums/status.enum';
import { RoleEnum } from '@/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
