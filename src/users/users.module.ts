import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DB } from '../db/DB';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DB],
})
export class UsersModule {}
