import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ServiceEntity } from './service.entity';
import { OrderProductEntity } from './order_product.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderDate: Date;

  @ManyToOne(() => ServiceEntity)
  service: ServiceEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
  orderProducts: OrderProductEntity[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;
}
