import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { DatabaseModule } from '../db/database.module';
import { trackProviders } from './track.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TracksController],
  providers: [TracksService, ...trackProviders],
})
export class TracksModule {}
