import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  if (configService.get<string>('NODE_ENV') === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [User],
      synchronize: true,
      dropSchema: true,
    };
  } else {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
      username: configService.get<string>('DB_USERNAME', 'root'),
      password: configService.get<string>('DB_PASSWORD', 'tisaude'),
      database: configService.get<string>('DB_NAME', 'cotacoes'),
      entities: [User],
      synchronize: false, // Use migrações em produção
      logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
    };
  }
};
