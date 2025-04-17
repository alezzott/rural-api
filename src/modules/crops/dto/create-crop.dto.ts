import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  season: string;

  @IsNotEmpty()
  @IsString()
  farmId: string;
}
