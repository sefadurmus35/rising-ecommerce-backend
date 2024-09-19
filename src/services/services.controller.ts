import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getServices() {
    return this.servicesService.getServices();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getService(@Param('id') id: number) {
    return this.servicesService.getService(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.createService(createServiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteService(@Param('id') id: number) {
    return this.servicesService.deleteService(id);
  }
}
