import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  title: string;

  @Column({ type: 'text' }) // Use 'text' for long descriptions
  description: string;

  @Column({ type: 'date' }) // Stores only the date (YYYY-MM-DD)
  date: string;

  //   @Column({ type: 'time' }) // Stores only the time (HH:mm:ss)
  //   time: string;

  // Relationship: Many diary records belong to one User
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
