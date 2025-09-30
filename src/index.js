const chalk = require('chalk').default || require('chalk');
const InterfaceCLI = require('./interface');
const { GerenciadorUsuarios } = require('./usuario');
const validaCPF = require('./cpf');

/**
 * Sistema de Gerenciamento de Usuários
 * Versão 2.0 - Reestruturado para integrar validação de CPF
 */
class SistemaGerenciamentoUsuarios {
    constructor() {
        this.gerenciador = new GerenciadorUsuarios();
        this.interface = new InterfaceCLI();
    }

    /**
     * Inicia o sistema em modo interativo
     */
    iniciarModoInterativo() {
        this.interface.iniciar();
    }

    /**
     * Executa o sistema em modo demonstração
     */
    async executarDemonstracao() {
        console.log(chalk.bold.blue('=== SISTEMA DE GERENCIAMENTO DE USUÁRIOS ==='));
        console.log(chalk.gray('Modo demonstração - Executando operações de exemplo...\n'));

        try {
            // Demonstrar validação de CPF
            console.log(chalk.yellow('1. Testando validação de CPF:'));
            const cpfsExemplo = ['123.456.789-09', '111.111.111-11', '000.000.001-91'];
            
            cpfsExemplo.forEach(cpf => {
                const valido = validaCPF(cpf);
                const status = valido ? chalk.green('✓ Válido') : chalk.red('✗ Inválido');
                console.log(`   CPF ${cpf}: ${status}`);
            });

            console.log(chalk.yellow('\n2. Cadastrando usuários de exemplo:'));
            
            // Cadastrar usuários de exemplo
            const usuariosExemplo = [
                {
                    nome: 'João Silva',
                    email: 'joao.silva@email.com',
                    cpf: '123.456.789-09',
                    telefone: '(11) 99999-1234'
                },
                {
                    nome: 'Maria Santos',
                    email: 'maria.santos@email.com',
                    cpf: '987.654.321-00',
                    telefone: '(11) 88888-5678'
                }
            ];

            for (const dadosUsuario of usuariosExemplo) {
                const resultado = this.gerenciador.adicionarUsuario(
                    dadosUsuario.nome,
                    dadosUsuario.email,
                    dadosUsuario.cpf,
                    dadosUsuario.telefone
                );

                if (resultado.sucesso) {
                    console.log(chalk.green(`   ✓ ${dadosUsuario.nome} cadastrado com sucesso`));
                } else {
                    console.log(chalk.red(`   ✗ Erro ao cadastrar ${dadosUsuario.nome}: ${resultado.erro}`));
                }
            }

            // Listar usuários cadastrados
            console.log(chalk.yellow('\n3. Listando usuários cadastrados:'));
            const usuarios = this.gerenciador.listarUsuarios();
            
            if (usuarios.length > 0) {
                usuarios.forEach((usuario, index) => {
                    console.log(chalk.cyan(`   ${index + 1}. ${usuario.nome}`));
                    console.log(chalk.white(`      Email: ${usuario.email}`));
                    console.log(chalk.white(`      CPF: ${usuario.cpf}`));
                    console.log(chalk.gray(`      ID: ${usuario.id}`));
                });
            } else {
                console.log(chalk.gray('   Nenhum usuário cadastrado.'));
            }

            // Mostrar estatísticas
            console.log(chalk.yellow('\n4. Estatísticas do sistema:'));
            const stats = this.gerenciador.obterEstatisticas();
            console.log(chalk.cyan(`   Total de usuários: ${stats.totalUsuarios}`));
            console.log(chalk.green(`   Usuários ativos: ${stats.usuariosAtivos}`));
            console.log(chalk.red(`   Usuários inativos: ${stats.usuariosInativos}`));

            // Demonstrar busca
            if (usuarios.length > 0) {
                console.log(chalk.yellow('\n5. Demonstrando busca por CPF:'));
                const primeiroUsuario = usuarios[0];
                const usuarioEncontrado = this.gerenciador.buscarPorCPF(primeiroUsuario.cpf);
                
                if (usuarioEncontrado) {
                    console.log(chalk.green(`   ✓ Usuário encontrado: ${usuarioEncontrado.nome}`));
                } else {
                    console.log(chalk.red('   ✗ Usuário não encontrado'));
                }
            }

            console.log(chalk.bold.green('\n=== Demonstração concluída com sucesso! ==='));
            console.log(chalk.gray('Para usar o sistema interativo, execute: npm start'));

        } catch (error) {
            console.error(chalk.red.bold('\n=== Erro durante a demonstração ==='));
            console.error(chalk.red(error.message));
            process.exit(1);
        }
    }

    /**
     * Obtém instância do gerenciador de usuários
     */
    obterGerenciador() {
        return this.gerenciador;
    }
}

// Função principal
async function main() {
    const sistema = new SistemaGerenciamentoUsuarios();
    
    // Verificar argumentos da linha de comando
    const args = process.argv.slice(2);
    
    if (args.includes('--demo') || args.includes('-d')) {
        // Executar em modo demonstração
        await sistema.executarDemonstracao();
    } else {
        // Executar em modo interativo
        sistema.iniciarModoInterativo();
    }
}

// Executar se for o arquivo principal
if (require.main === module) {
    main();
}

module.exports = SistemaGerenciamentoUsuarios;