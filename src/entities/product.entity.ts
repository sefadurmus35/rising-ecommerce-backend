import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderProductEntity } from './order_product.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
  orderProducts: OrderProductEntity[];
}
