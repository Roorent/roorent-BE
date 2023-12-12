import { PhotoReviews } from '#/photo_reviews/entities/photo_reviews.entity'
import { Products } from '#/products/enitities/products.entity'
import { Transactions } from '#/transactions/entities/transactions.entity'
import { Users } from '#/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @ManyToOne(() => Products, (product) => product.reviews)
  product: Products

  @OneToMany(() => PhotoReviews, (photoReviews) => photoReviews.reviews)
  photoReviews: PhotoReviews

  @OneToOne(() => Transactions)
  @JoinColumn()
  transactions: Transactions
}
