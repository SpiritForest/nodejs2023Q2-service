import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { albumProviders } from './album.providers';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AlbumController],
  providers: [AlbumService, ...albumProviders],
})
export class AlbumModule {}
