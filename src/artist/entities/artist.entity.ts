import { Album } from '../../album/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Track, track => track.artist, { onDelete: 'SET NULL' })
  tracks: Track[];

  @OneToMany(() => Album, album => album.artist, { onDelete: 'SET NULL'})
  albums: Album[];
}
