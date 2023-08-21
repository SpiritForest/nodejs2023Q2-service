import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { validate as validateUUID } from 'uuid';
import { validate as validateEntity } from 'class-validator';

@Injectable()
export class ArtistService {
  constructor(
    @Inject('ARTIST_REPOSITORY')
    private artistRepository: Repository<Artist>,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artistDto = new CreateArtistDto();

    Object.assign(artistDto, createArtistDto);

    return validateEntity(artistDto).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }
      const artist = this.artistRepository.create(createArtistDto);

      return this.artistRepository.save(artist);
    });
  }

  findAll() {
    return this.artistRepository.find();
  }

  async findOne(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const artistDto = new UpdateArtistDto();

    Object.assign(artistDto, updateArtistDto);

    await validateEntity(artistDto).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }
    });

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException();
    }

    Object.assign(artist, updateArtistDto);

    return this.artistRepository.save(artist);
  }

  async remove(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException();
    }

    return this.artistRepository.remove(artist);
  }
}
