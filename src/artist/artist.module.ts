import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { artistProviders } from './artist.providers';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService, ...artistProviders],
})
export class ArtistModule {}
