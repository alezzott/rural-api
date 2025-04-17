import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Soja' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2024/2025' })
  season: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'b09f53d7-3bf3-431d-b6f0-8cbb98d6ab1b' })
  farmId: string;
}
