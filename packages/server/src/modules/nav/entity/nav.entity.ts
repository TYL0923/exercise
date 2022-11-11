import { MySqlDatabaseColumn } from 'src/typing/databaseColumn.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nav')
export class Nav {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 50,
  })
  pid: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 50,
    unique: true,
  })
  path: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 20,
  })
  label: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 30,
  })
  name: string;

  @Column({
    type: MySqlDatabaseColumn.VARCHAR,
    length: 20,
  })
  icon: string;
}
