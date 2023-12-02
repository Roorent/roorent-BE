import { PhotoReviews } from '#/photo_reviews/entities/photo_reviews.entity'
import { Users } from '#/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'int',
  })
  rating: number

  @Column({ type: 'text' })
  content: string

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

  @VersionColumn()
  version: number

  @ManyToOne(() => Users, (user) => user.reviews)
  user: Users

  @OneToMany(() => PhotoReviews, (photoReviews) => photoReviews.reviews)
  photoReviews: PhotoReviews
}
