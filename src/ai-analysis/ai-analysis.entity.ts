import { Column } from 'typeorm';

export class AiAnalysis {
  @Column({ nullable: true })
  language: string;

  @Column({ type: 'float', nullable: true })
  score: number;

  @Column({ nullable: true })
  mood: string;
}
