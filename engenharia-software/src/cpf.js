/**
 * Valida uma string de CPF.
 * A função realiza as seguintes verificações:
 * 1. Remove caracteres não numéricos.
 * 2. Verifica se o CPF possui 11 dígitos.
 * 3. Verifica se todos os dígitos são iguais (caso inválido).
 * 4. Calcula e valida os dois dígitos verificadores.
 *
 * @param {string} cpf - A string do CPF a ser validada.
 * @returns {boolean} - Retorna `true` se o CPF for válido, `false` caso contrário.
 */
function validaCPF(cpf) {
    // Verificação inicial: se não é string ou número, já é inválido
    if (cpf === null || cpf === undefined) {
        return false;
    }

    const cpfString = String(cpf);
    
    // Verifica se contém apenas dígitos e caracteres de formatação válidos (., -, espaços)
    if (!/^[\d\s\.\-]*$/.test(cpfString)) {
        return false;
    }

    // 1. Remove caracteres não numéricos (pontos, traços, espaços)
    const cpfLimpo = cpfString.replace(/\D/g, '');

    // 2. Verifica se o CPF possui 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false;
    }

    // 3. Verifica se todos os dígitos são iguais
    // Ex: "11111111111" é um padrão inválido conhecido.
    const todosDigitosIguais = /^(\d)\1{10}$/.test(cpfLimpo);
    if (todosDigitosIguais) {
        return false;
    }

    // Função auxiliar para calcular um dígito verificador
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

    // 4. Calcula e valida os dígitos verificadores
    const novePrimeirosDigitos = cpfLimpo.substring(0, 9);
    const primeiroDigitoVerificador = calcularDigito(novePrimeirosDigitos);

    // Verifica se o primeiro dígito calculado bate com o real
    if (primeiroDigitoVerificador !== parseInt(cpfLimpo[9])) {
        return false;
    }

    const dezPrimeirosDigitos = cpfLimpo.substring(0, 10);
    const segundoDigitoVerificador = calcularDigito(dezPrimeirosDigitos);

    // Verifica se o segundo dígito calculado bate com o real
    if (segundoDigitoVerificador !== parseInt(cpfLimpo[10])) {
        return false;
    }

    // Se passou por todas as verificações, o CPF é válido.
    return true;
}

// Exporta a função para que possa ser usada em outros módulos
module.exports = validaCPF;