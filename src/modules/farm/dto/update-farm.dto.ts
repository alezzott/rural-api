import { PartialType } from '@nestjs/swagger';
import { CreateFarmDto } from './farm-create.dto';

export class UpdateFarmDto extends PartialType(CreateFarmDto) {}
