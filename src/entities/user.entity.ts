import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('decimal', { precision: 10, scale: 2, default: 100 })
  balance: number;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
