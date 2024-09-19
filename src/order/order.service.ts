import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from '../entities/user.entity';
import { ServiceEntity } from '../entities/service.entity';
import { ProductEntity } from '../entities/product.entity';
import { OrderProductEntity } from '../entities/order_product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}

  async getAllOrders(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: ['user', 'service', 'orderProducts'],
    });
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { orderDate, serviceId, userId, products } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    let totalPrice = service.price;

    for (const productOrder of products) {
      const product = await this.productRepository.findOne({
        where: { id: productOrder.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productOrder.productId} not found`,
        );
      }

      if (product.stock < productOrder.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${productOrder.productId}`,
        );
      }

      totalPrice += product.price * productOrder.quantity;
    }

    if (user.balance < totalPrice) {
      throw new BadRequestException('Insufficient balance');
    }

    const order = this.orderRepository.create({
      orderDate,
      user,
      service,
      totalPrice,
    });

    await this.orderRepository.save(order);

    for (const productOrder of products) {
      const product = await this.productRepository.findOne({
        where: { id: productOrder.productId },
      });

      const orderProduct = this.orderProductRepository.create({
        order,
        product,
        quantity: productOrder.quantity,
      });

      await this.orderProductRepository.save(orderProduct);

      // Decrease the stock of the product
      product.stock -= productOrder.quantity;
      await this.productRepository.save(product);
    }

    // Decrease the user's balance
    user.balance -= totalPrice;
    await this.userRepository.save(user);

    return order;
  }
}
