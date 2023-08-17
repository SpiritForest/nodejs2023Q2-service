import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt/dist';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { userProviders } from '../users/user.providers';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
    } as JwtModuleOptions),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ...userProviders],
})
export class AuthModule {}
