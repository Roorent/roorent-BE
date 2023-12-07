import { Cities } from '#/cities/entities/cities.entity'
import { Favorits } from '#/fav_product/entities/favorits.entity'
import { PhotoProducts } from '#/photo_products/entities/photo_products.entity'
import { ProductDescriptions } from '#/product_descriptions/entities/product_descriptions.entity'
import { Reviews } from '#/reviews/entities/reviews.entity'
import { RentApplications } from '#/rent_applications/entities/rent_applications.entity'
import { SpecialRules } from '#/special_rules/entities/special_rules.entity'
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
} from 'typeorm'

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'varchar',
    length: 120,
  })
  name: string

  @Column({
    type: 'varchar',
    length: 25,
  })
  type: string

  @Column({
    type: 'int',
    nullable: true,
  })
  stock: number

  @Column({
    type: 'int',
    nullable: true,
  })
  daily_price: number

  @Column({
    type: 'int',
    nullable: true,
  })
  monthly_price: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string

  @Column({
    default: true,
    nullable: true,
  })
  active_status: boolean

  @Column({
    type: 'varchar',
    length: 255,
  })
  latitude: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  longitude: string

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

  @ManyToOne(() => Users, (user) => user.products)
  user: Users

  @OneToOne(() => ProductDescriptions)
  @JoinColumn()
  productDescriptions: ProductDescriptions

  @OneToOne(() => SpecialRules)
  @JoinColumn()
  specialRules: SpecialRules

  @OneToMany(() => PhotoProducts, (photoProducts) => photoProducts.products)
  photoProducts: PhotoProducts

  @ManyToOne(() => Cities, (cities) => cities.products)
  cities: Cities

  @OneToMany(() => Reviews, (reviews) => reviews.product)
  reviews: Reviews

  @OneToMany(() => Favorits, (favorit)=> favorit.product)
  favorit: Favorits[];

  @OneToMany(() => RentApplications, (rentApplications)=> rentApplications.product)
  rentApplications: RentApplications
}
