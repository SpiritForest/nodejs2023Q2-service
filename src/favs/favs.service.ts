import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Favorite } from './entities/fav.entity';
import { DataSource, Repository } from 'typeorm';
import { Track } from '../tracks/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class FavsService {
  favoriteRepository: Repository<Favorite>;
  trackRepository: Repository<Track>;
  albumRepository: Repository<Album>;
  artistRepository: Repository<Artist>;

  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {
    this.favoriteRepository = this.dataSource.getRepository(Favorite);
    this.trackRepository = this.dataSource.getRepository(Track);
    this.albumRepository = this.dataSource.getRepository(Album);
    this.artistRepository = this.dataSource.getRepository(Artist);
  }

  findAll() {
    return this.getFavorite();
  }

  async getFavorite() {
    const favorites = await this.favoriteRepository.find();
    const favorite = favorites[0];

    if (!favorite) {
      const favorite = this.favoriteRepository.create({
        tracks: [],
        albums: [],
        artists: [],
      });

      return this.favoriteRepository.save(favorite);
    } else {
      return favorite;
    }
  }

  async addTrack(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new HttpException('Invalid data', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorite = await this.getFavorite();

    favorite.tracks = [...favorite.tracks, track];

    return this.favoriteRepository.save(favorite);
  }

  async addAlbum(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new HttpException('Invalid data', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorite = await this.getFavorite();

    favorite.albums = [...favorite.albums, album];

    return this.favoriteRepository.save(favorite);
  }

  async addArtist(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new HttpException('Invalid data', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const favorite = await this.getFavorite();

    favorite.artists = [...favorite.artists, artist];

    return this.favoriteRepository.save(favorite);
  }

  async removeTrack(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const favorite = await this.getFavorite();
    const trackInFavorites = favorite.tracks.find((track) => track.id === id);

    if (!trackInFavorites) {
      throw new NotFoundException();
    }

    favorite.tracks = favorite.tracks.filter((track) => track.id !== id);

    return this.favoriteRepository.save(favorite);
  }

  async removeAlbum(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const favorite = await this.getFavorite();
    const albumInFavorites = favorite.albums.find((album) => album.id === id);

    if (!albumInFavorites) {
      throw new NotFoundException();
    }

    favorite.albums = favorite.albums.filter((album) => album.id !== id);

    return this.favoriteRepository.save(favorite);
  }

  async removeArtist(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const favorite = await this.getFavorite();
    const artistInFavorites = favorite.artists.find(
      (artist) => artist.id === id,
    );

    if (!artistInFavorites) {
      throw new NotFoundException();
    }

    favorite.artists = favorite.artists.filter((artist) => artist.id !== id);

    return this.favoriteRepository.save(favorite);
  }
}
