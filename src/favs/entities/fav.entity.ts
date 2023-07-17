import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, { eager: true })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, { eager: true })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, { eager: true })
  @JoinTable()
  tracks: Track[];
}
