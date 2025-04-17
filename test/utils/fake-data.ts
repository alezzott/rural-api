import { cpf, cnpj } from 'cpf-cnpj-validator';

const farmNames = [
  'Fazenda Bela Vista',
  'Fazenda Esperança',
  'Fazenda Aurora',
  'Fazenda Primavera',
];
const cropNames = ['Soja', 'Milho', 'Café', 'Algodão', 'Arroz', 'Feijão'];
const producerNames = [
  'João Silva',
  'Maria Souza',
  'Carlos Oliveira',
  'Ana Paula',
  'Pedro Santos',
];

function randomSuffix() {
  return ' ' + (Math.floor(Math.random() * 30) + 1);
}

export function randomFarmName() {
  return (
    farmNames[Math.floor(Math.random() * farmNames.length)] + randomSuffix()
  );
}

export function randomCropName() {
  return (
    cropNames[Math.floor(Math.random() * cropNames.length)] + randomSuffix()
  );
}

export function randomProducerName() {
  return (
    producerNames[Math.floor(Math.random() * producerNames.length)] +
    randomSuffix()
  );
}

export function randomCpf() {
  return cpf.generate();
}

export function randomCnpj() {
  return cnpj.generate();
}
