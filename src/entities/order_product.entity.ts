import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity('order_product')
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderProducts)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderProducts)
  product: ProductEntity;

  @Column()
  quantity: number;
}
