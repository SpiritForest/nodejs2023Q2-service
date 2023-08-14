import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { validate as validateUUID } from 'uuid';
import { validate as validateEntity } from 'class-validator';

@Injectable()
export class TracksService {
  constructor(
    @Inject('TRACK_REPOSITORY')
    private trackRepository: Repository<Track>,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const trackDto = new CreateTrackDto();

    Object.assign(trackDto, createTrackDto);

    return validateEntity(trackDto).then(async (errors) => {
      if (errors.length) {
        throw new BadRequestException();
      } else {
        const track = this.trackRepository.create(createTrackDto);

        return this.trackRepository.save(track);
      }
    });
  }

  findAll() {
    return this.trackRepository.find();
  }

  async findOne(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const trackDto = new UpdateTrackDto();

    Object.assign(trackDto, updateTrackDto);

    await validateEntity(trackDto).then((errors) => {
      if (errors.length) {
        throw new BadRequestException();
      }
    });

    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException();
    }

    Object.assign(track, updateTrackDto);

    return this.trackRepository.save(track);
  }

  async remove(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException();
    }

    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException();
    }

    return this.trackRepository.remove(track);
  }
}
