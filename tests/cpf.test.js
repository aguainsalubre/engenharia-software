const validaCPF = require('../src/cpf');

describe('Validação de CPF', () => {
    describe('Casos Positivos (CPFs Válidos)', () => {
        test('deve validar CPF válido com formatação completa', () => {
            expect(validaCPF('123.456.789-09')).toBe(true);
        });

        test('deve validar CPF válido sem formatação', () => {
            expect(validaCPF('12345678909')).toBe(true);
        });

        test('deve validar CPF válido com formatação parcial', () => {
            expect(validaCPF('123456789-09')).toBe(true);
        });

        test('deve validar CPF válido conhecido', () => {
            expect(validaCPF('000.000.001-91')).toBe(true);
        });

        test('deve validar outro CPF válido conhecido', () => {
            expect(validaCPF('987.654.321-00')).toBe(true);
        });

        test('deve validar CPF com espaços extras', () => {
            expect(validaCPF(' 123.456.789-09 ')).toBe(true);
        });
    });

    describe('Casos Negativos (CPFs Inválidos)', () => {
        test('deve rejeitar CPF com todos os dígitos iguais', () => {
            expect(validaCPF('111.111.111-11')).toBe(false);
        });

        test('deve rejeitar CPF com todos os zeros', () => {
            expect(validaCPF('000.000.000-00')).toBe(false);
        });

        test('deve rejeitar CPF com menos de 11 dígitos', () => {
            expect(validaCPF('123.456.789')).toBe(false);
        });

        test('deve rejeitar CPF com mais de 11 dígitos', () => {
            expect(validaCPF('123.456.789-091')).toBe(false);
        });

        test('deve rejeitar CPF com dígito verificador incorreto', () => {
            expect(validaCPF('123.456.789-00')).toBe(false);
        });

        test('deve rejeitar string vazia', () => {
            expect(validaCPF('')).toBe(false);
        });

        test('deve rejeitar null', () => {
            expect(validaCPF(null)).toBe(false);
        });

        test('deve rejeitar undefined', () => {
            expect(validaCPF(undefined)).toBe(false);
        });

        test('deve rejeitar CPF com letras', () => {
            expect(validaCPF('123.abc.789-09')).toBe(false);
        });

        test('deve rejeitar CPF com caracteres especiais', () => {
            expect(validaCPF('123@456#789$09')).toBe(false);
        });
    });

    describe('Casos Extremos', () => {
        test('deve lidar com número como entrada', () => {
            expect(validaCPF(12345678909)).toBe(true);
        });

        test('deve rejeitar número com mais dígitos', () => {
            expect(validaCPF(123456789091)).toBe(false);
        });

        test('deve rejeitar objeto', () => {
            expect(validaCPF({})).toBe(false);
        });

        test('deve rejeitar array', () => {
            expect(validaCPF([])).toBe(false);
        });
    });
});

