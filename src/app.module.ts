import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistModule, AlbumModule, FavsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
