# Sistema Simples

Sistema demonstrativo de gerenciamento de dependências e build automatizado com npm.

## Dependências Externas

- **axios**: Cliente HTTP para APIs
- **moment**: Manipulação de datas
- **chalk**: Estilização de console

## Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Executar aplicação
npm start

# Build completo
npm run build

# Limpar projeto
npm run clean

# Desenvolvimento com auto-reload
npx nodemon src/index.js
````

## Validação de CPF (Desenvolvido com TDD)
Esta funcionalidade permite a validação de números de CPF (Cadastro de Pessoas Físicas) do Brasil. O módulo foi inteiramente construído seguindo a metodologia de Desenvolvimento Orientado a Testes (TDD) para garantir máxima confiabilidade e precisão.

A função validaCPF recebe uma string contendo um CPF e retorna true se for válido e false caso contrário.

Como Usar
Para utilizar o validador, importe o módulo src/cpf.js e chame a função.

Exemplo:

### JavaScript
```bash 
const validaCPF = require('./src/cpf');

// CPF válido
console.log(validaCPF('123.456.789-00')); // Saída: true (use um CPF de teste válido)

// CPF inválido
console.log(validaCPF('111.222.333-44')); // Saída: false
```
### Regras de Validação
A função implementa as seguintes verificações:

Remove formatações (pontos e traços).

Garante que o CPF tenha 11 dígitos.

Rejeita CPFs com todos os dígitos iguais (ex: 11111111111).

Valida os dois dígitos verificadores através do algoritmo oficial.

Testes da Funcionalidade
Uma suíte de testes foi criada para cobrir todos os cenários de validação. Para executá-la, utilize o seguinte comando:

Bash

npm test
Sobre o Processo de Desenvolvimento (TDD)
O desenvolvimento seguiu o ciclo "Red-Green-Refactor" do TDD.

Erro (Red): Primeiramente, foram escritos testes para a função validaCPF antes mesmo de ela existir. Naturalmente, esses testes falharam, servindo como um guia claro dos requisitos que a função deveria atender.

Correção (Green): Em seguida, a lógica da função validaCPF foi implementada passo a passo, com o objetivo de fazer os testes passarem.

Refatoração (Refactor): O código foi revisado para melhorar a clareza e a eficiência, garantindo que todos os testes continuassem passando.

Este processo assegura que a funcionalidade não apenas funciona como esperado, mas também é robusta e bem documentada por seus próprios testes.
