import { validate } from 'class-validator';
import { CreateProducerDto } from './create-producer.dto';

describe('CreateProducerDto', () => {
  it('deve aceitar CPF válido', async () => {
    const dto = new CreateProducerDto();
    dto.name = 'João';
    dto.cpfCnpj = '39053344705'; // CPF válido

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve aceitar CNPJ válido', async () => {
    const dto = new CreateProducerDto();
    dto.name = 'Empresa';
    dto.cpfCnpj = '19131243000197'; // CNPJ válido

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve rejeitar CPF inválido', async () => {
    const dto = new CreateProducerDto();
    dto.name = 'João';
    dto.cpfCnpj = '12345678900'; // CPF inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('CpfCnpjValidator');
  });

  it('deve rejeitar CNPJ inválido', async () => {
    const dto = new CreateProducerDto();
    dto.name = 'Empresa';
    dto.cpfCnpj = '12345678000100'; // CNPJ inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('CpfCnpjValidator');
  });

  it('deve rejeitar criação com nome vazio', async () => {
    const dto = new CreateProducerDto();
    dto.name = '';
    dto.cpfCnpj = '39053344705'; // CPF válido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
