import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  company_id: number;

  @Column()
  address: string;
}
