import { Reviews } from "#/reviews/entities/reviews.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PhotoReviews{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  photo: string[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date
  
  @ManyToOne(() => Reviews, (reviews) => reviews.photoReviews)
  reviews: Reviews;
}