import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto);
  }
}
