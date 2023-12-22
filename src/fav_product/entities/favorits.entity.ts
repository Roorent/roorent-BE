import { Products } from "#/products/enitities/products.entity";
import { Users } from "#/users/entities/user.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Favorits{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
      })
      createdAt: Date;
    
      @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
      })
      updatedAt: Date;
    
      @DeleteDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
      })
      deletedAt: Date;

      @ManyToOne(() => Users, (user) => user.favorit)
      user: Users;

      @ManyToOne(() => Products, (product) => product.favorit)
      product: Products;
}