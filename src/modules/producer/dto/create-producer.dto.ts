import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CpfCnpjValidator } from '../../../common/validators/cnpj-cpf-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Validate(CpfCnpjValidator)
  cpfCnpj: string;
}
