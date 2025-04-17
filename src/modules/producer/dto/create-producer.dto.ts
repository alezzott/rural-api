import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CpfCnpjValidator } from '../../../common/validators/cnpj-cpf-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @IsNotEmpty()
  @Validate(CpfCnpjValidator)
  @ApiProperty({ example: '39053344705' })
  cpfCnpj: string;
}
