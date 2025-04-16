import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'CpfCnpjValidator', async: false })
export class CpfCnpjValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return cpf.isValid(value) || cnpj.isValid(value);
  }

  defaultMessage(): string {
    return 'CPF/CNPJ inválido';
  }
}
