import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { validate as validateUUID } from 'uuid';
import { validate as validateEntity } from 'class-validator';

@Injectable()
export class AlbumService {
  constructor(
    @Inject('ALBUM_REPOSITORY')
    private albumRepository: Repository<Album>
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const albumDto = new CreateAlbumDto();

    Object.assign(albumDto, createAlbumDto);

    return validateEntity(albumDto).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }

      const album = this.albumRepository.create(createAlbumDto);

      return this.albumRepository.save(album);
    })
  }

  findAll() {
    return this.albumRepository.find();
  }

  async findOne(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    const albumDto = new UpdateAlbumDto();

    Object.assign(albumDto, updateAlbumDto);

    await validateEntity(albumDto).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }
    });

    Object.assign(album, updateAlbumDto);

    return this.albumRepository.save(album);
  }

  async remove(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }    

    return this.albumRepository.remove(album);
  }
}
