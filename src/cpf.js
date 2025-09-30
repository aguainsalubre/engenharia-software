/**
 * Valida uma string ou número de CPF.
 * A função realiza as seguintes verificações:
 * 1. Converte a entrada para string para um tratamento unificado.
 * 2. Remove caracteres não numéricos.
 * 3. Verifica se o CPF possui 11 dígitos.
 * 4. Verifica se todos os dígitos são iguais (caso inválido).
 * 5. Calcula e valida os dois dígitos verificadores.
 *
 * @param {string|number} cpf - O CPF a ser validado.
 * @returns {boolean} - Retorna `true` se o CPF for válido, `false` caso contrário.
 */
function validaCPF(cpf) {
    if (!cpf) return false;

    // Converte a entrada para string e remove caracteres não numéricos
    const cpfLimpo = String(cpf).replace(/\D/g, '');

    // Deve ter 11 dígitos
    if (cpfLimpo.length !== 11) return false;

    // Rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    // Função para calcular dígito verificador
    const calcularDigito = (cpfParcial) => {
        let soma = 0;
        let multiplicador = cpfParcial.length + 1;
        for (const digito of cpfParcial) {
            soma += parseInt(digito, 10) * multiplicador;
            multiplicador--;
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    // Verifica os dois dígitos verificadores
    const primeiroDigito = calcularDigito(cpfLimpo.substring(0, 9));
    if (primeiroDigito !== parseInt(cpfLimpo[9], 10)) return false;

    const segundoDigito = calcularDigito(cpfLimpo.substring(0, 10));
    if (segundoDigito !== parseInt(cpfLimpo[10], 10)) return false;

    return true;
}

// Exporta a função
module.exports = validaCPF;ts = validaCPF;