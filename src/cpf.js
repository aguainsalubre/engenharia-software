/**
 * Valida uma string de CPF.
 * A função realiza as seguintes verificações:
 * 1. Verifica se contém apenas dígitos, pontos e traços (sem letras/símbolos).
 * 2. Remove caracteres não numéricos.
 * 3. Verifica se o CPF possui 11 dígitos.
 * 4. Verifica se todos os dígitos são iguais (caso inválido).
 * 5. Calcula e valida os dois dígitos verificadores.
 *
 * @param {string|number} cpf - A string do CPF a ser validada.
 * @returns {boolean} - Retorna `true` se o CPF for válido, `false` caso contrário.
 */
function validaCPF(cpf) {
    if (typeof cpf !== 'string') return false;

    // Não permitir caracteres além de números, pontos e traços
    if (!/^[0-9.\-\s]+$/.test(cpf)) {
        return false;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    const calcularDigito = (cpfParcial) => {
        let soma = 0;
        let multiplicador = cpfParcial.length + 1;

        for (const digito of cpfParcial) {
            soma += parseInt(digito) * multiplicador;
            multiplicador--;
        }

        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calcularDigito(cpfLimpo.substring(0, 9));
    if (primeiroDigito !== parseInt(cpfLimpo[9])) return false;

    const segundoDigito = calcularDigito(cpfLimpo.substring(0, 10));
    if (segundoDigito !== parseInt(cpfLimpo[10])) return false;

    return true;
}

// Exporta a função para que possa ser usada em outros módulos
module.exports = validaCPF;