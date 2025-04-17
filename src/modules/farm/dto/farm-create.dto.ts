import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Fazenda Primavera' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Cidade Exemplo' })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'SP' })
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 100 })
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 60 })
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 40 })
  vegetationArea: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'c9d69166-ad05-45ef-96b2-c2ea4e3d87f9' })
  producerId: string;
}
