// Importa a função (que ainda será criada)
const validaCPF = require('../src/cpf');

// Descreve o conjunto de testes para a validação de CPF
describe('Validação de CPF', () => {
    // Teste 1: Deve retornar `true` para um CPF sabidamente válido.
    test('deve retornar true para um CPF válido', () => {
        const cpfValido = '01234567890'; // Exemplo de CPF que deve ser válido após a lógica
        expect(validaCPF(cpfValido)).toBe(true);
    });

    // Teste 2: Deve retornar `false` para um CPF com todos os dígitos iguais.
    test('deve retornar false para um CPF com todos os dígitos iguais', () => {
        const cpfInvalido = '11111111111';
        expect(validaCPF(cpfInvalido)).toBe(false);
    });

    // Teste 3: Deve retornar `false` para um CPF com quantidade de dígitos incorreta.
    test('deve retornar false para um CPF com menos de 11 dígitos', () => {
        const cpfInvalido = '12345';
        expect(validaCPF(cpfInvalido)).toBe(false);
    });

    // Teste 4: Deve retornar `false` para um CPF com dígitos verificadores inválidos.
    test('deve retornar false para um CPF com dígitos verificadores inválidos', () => {
        const cpfInvalido = '01234567899'; // Final alterado para invalidar
        expect(validaCPF(cpfInvalido)).toBe(false);
    });
});