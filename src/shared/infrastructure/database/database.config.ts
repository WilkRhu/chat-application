import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Message } from '@/message/entities/message.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  if (configService.get<string>('NODE_ENV') === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Message],
      synchronize: true,
      dropSchema: true,
    };
  } else {
    return {
      type: 'mysql',
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: parseInt(configService.get<string>('DATABASE_PORT', '3306'), 10),
      username: configService.get<string>('DATABASE_USERNAME', 'root'),
      password: configService.get<string>('DATABASE_PASSWORD', 'tisaude'),
      database: configService.get<string>('DATABASE_NAME', 'chat_app'),
      entities: [User, Message],
      synchronize: true,
      logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
    };
  }
};
