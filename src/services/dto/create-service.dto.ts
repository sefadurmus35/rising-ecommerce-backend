import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
