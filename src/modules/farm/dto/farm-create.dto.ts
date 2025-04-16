import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  vegetationArea: number;

  @IsNotEmpty()
  @IsString()
  producerId: string;
}
