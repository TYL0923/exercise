import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('note')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
