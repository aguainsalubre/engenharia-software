const readline = require('readline');
const chalk = require('chalk').default || require('chalk');
const { GerenciadorUsuarios } = require('./usuario');

/**
 * Interface de linha de comando para o sistema de gerenciamento de usuários
 */
class InterfaceCLI {
    constructor() {
        this.gerenciador = new GerenciadorUsuarios();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Inicia a interface
     */
    iniciar() {
        this.mostrarBanner();
        this.mostrarMenu();
    }

    /**
     * Mostra o banner do sistema
     */
    mostrarBanner() {
        console.clear();
        console.log(chalk.bold.blue('╔══════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.blue('║') + chalk.bold.white('          SISTEMA DE GERENCIAMENTO DE USUÁRIOS           ') + chalk.bold.blue('║'));
        console.log(chalk.bold.blue('║') + chalk.white('                    Versão 2.0                           ') + chalk.bold.blue('║'));
        console.log(chalk.bold.blue('╚══════════════════════════════════════════════════════════╝'));
        console.log();
    }

    /**
     * Mostra o menu principal
     */
    mostrarMenu() {
        console.log(chalk.yellow('=== MENU PRINCIPAL ==='));
        console.log(chalk.white('1. ') + chalk.cyan('Cadastrar usuário'));
        console.log(chalk.white('2. ') + chalk.cyan('Listar usuários'));
        console.log(chalk.white('3. ') + chalk.cyan('Buscar usuário'));
        console.log(chalk.white('4. ') + chalk.cyan('Atualizar usuário'));
        console.log(chalk.white('5. ') + chalk.cyan('Remover usuário'));
        console.log(chalk.white('6. ') + chalk.cyan('Estatísticas do sistema'));
        console.log(chalk.white('7. ') + chalk.cyan('Validar CPF'));
        console.log(chalk.white('0. ') + chalk.red('Sair'));
        console.log();

        this.rl.question(chalk.yellow('Escolha uma opção: '), (opcao) => {
            this.processarOpcao(opcao.trim());
        });
    }

    /**
     * Processa a opção escolhida pelo usuário
     */
    processarOpcao(opcao) {
        switch (opcao) {
            case '1':
                this.cadastrarUsuario();
                break;
            case '2':
                this.listarUsuarios();
                break;
            case '3':
                this.buscarUsuario();
                break;
            case '4':
                this.atualizarUsuario();
                break;
            case '5':
                this.removerUsuario();
                break;
            case '6':
                this.mostrarEstatisticas();
                break;
            case '7':
                this.validarCPF();
                break;
            case '0':
                this.sair();
                break;
            default:
                console.log(chalk.red('Opção inválida!'));
                this.voltarMenu();
        }
    }

    /**
     * Cadastra um novo usuário
     */
    cadastrarUsuario() {
        console.log(chalk.yellow('\n=== CADASTRAR USUÁRIO ==='));
        
        this.rl.question('Nome: ', (nome) => {
            this.rl.question('Email: ', (email) => {
                this.rl.question('CPF: ', (cpf) => {
                    this.rl.question('Telefone (opcional): ', (telefone) => {
                        const resultado = this.gerenciador.adicionarUsuario(
                            nome, 
                            email, 
                            cpf, 
                            telefone || null
                        );

                        if (resultado.sucesso) {
                            console.log(chalk.green('\n✓ ' + resultado.mensagem));
                            console.log(chalk.gray('ID do usuário: ' + resultado.usuario.id));
                        } else {
                            console.log(chalk.red('\n✗ Erro: ' + resultado.erro));
                        }

                        this.voltarMenu();
                    });
                });
            });
        });
    }

    /**
     * Lista todos os usuários
     */
    listarUsuarios() {
        console.log(chalk.yellow('\n=== LISTA DE USUÁRIOS ==='));
        
        const usuarios = this.gerenciador.listarUsuarios();
        
        if (usuarios.length === 0) {
            console.log(chalk.gray('Nenhum usuário cadastrado.'));
        } else {
            usuarios.forEach((usuario, index) => {
                console.log(chalk.cyan(`\n${index + 1}. ${usuario.nome}`));
                console.log(chalk.white(`   ID: ${usuario.id}`));
                console.log(chalk.white(`   Email: ${usuario.email}`));
                console.log(chalk.white(`   CPF: ${usuario.cpf}`));
                console.log(chalk.white(`   Telefone: ${usuario.telefone || 'Não informado'}`));
                console.log(chalk.gray(`   Cadastrado em: ${usuario.dataCadastro}`));
            });
        }

        this.voltarMenu();
    }

    /**
     * Busca um usuário
     */
    buscarUsuario() {
        console.log(chalk.yellow('\n=== BUSCAR USUÁRIO ==='));
        console.log('1. Buscar por ID');
        console.log('2. Buscar por CPF');
        console.log('3. Buscar por Email');
        
        this.rl.question('Escolha o tipo de busca: ', (tipo) => {
            switch (tipo.trim()) {
                case '1':
                    this.rl.question('Digite o ID: ', (id) => {
                        const usuario = this.gerenciador.buscarPorId(id);
                        this.mostrarResultadoBusca(usuario);
                    });
                    break;
                case '2':
                    this.rl.question('Digite o CPF: ', (cpf) => {
                        const usuario = this.gerenciador.buscarPorCPF(cpf);
                        this.mostrarResultadoBusca(usuario);
                    });
                    break;
                case '3':
                    this.rl.question('Digite o Email: ', (email) => {
                        const usuario = this.gerenciador.buscarPorEmail(email);
                        this.mostrarResultadoBusca(usuario);
                    });
                    break;
                default:
                    console.log(chalk.red('Opção inválida!'));
                    this.voltarMenu();
            }
        });
    }

    /**
     * Mostra o resultado da busca
     */
    mostrarResultadoBusca(usuario) {
        if (usuario) {
            console.log(chalk.green('\n✓ Usuário encontrado:'));
            console.log(chalk.cyan(`Nome: ${usuario.nome}`));
            console.log(chalk.white(`ID: ${usuario.id}`));
            console.log(chalk.white(`Email: ${usuario.email}`));
            console.log(chalk.white(`CPF: ${usuario.cpf}`));
            console.log(chalk.white(`Telefone: ${usuario.telefone || 'Não informado'}`));
            console.log(chalk.gray(`Cadastrado em: ${usuario.dataCadastro}`));
        } else {
            console.log(chalk.red('\n✗ Usuário não encontrado.'));
        }
        this.voltarMenu();
    }

    /**
     * Atualiza um usuário
     */
    atualizarUsuario() {
        console.log(chalk.yellow('\n=== ATUALIZAR USUÁRIO ==='));
        
        this.rl.question('Digite o ID do usuário: ', (id) => {
            const usuario = this.gerenciador.buscarPorId(id);
            
            if (!usuario) {
                console.log(chalk.red('\n✗ Usuário não encontrado.'));
                this.voltarMenu();
                return;
            }

            console.log(chalk.green('\nUsuário encontrado: ' + usuario.nome));
            console.log(chalk.gray('Deixe em branco para manter o valor atual.'));
            
            this.rl.question(`Nome (${usuario.nome}): `, (nome) => {
                this.rl.question(`Email (${usuario.email}): `, (email) => {
                    this.rl.question(`CPF (${usuario.cpf}): `, (cpf) => {
                        this.rl.question(`Telefone (${usuario.telefone || 'Não informado'}): `, (telefone) => {
                            const dadosAtualizacao = {};
                            
                            if (nome.trim()) dadosAtualizacao.nome = nome.trim();
                            if (email.trim()) dadosAtualizacao.email = email.trim();
                            if (cpf.trim()) dadosAtualizacao.cpf = cpf.trim();
                            if (telefone.trim()) dadosAtualizacao.telefone = telefone.trim();

                            const resultado = this.gerenciador.atualizarUsuario(id, dadosAtualizacao);

                            if (resultado.sucesso) {
                                console.log(chalk.green('\n✓ ' + resultado.mensagem));
                            } else {
                                console.log(chalk.red('\n✗ Erro: ' + resultado.erro));
                            }

                            this.voltarMenu();
                        });
                    });
                });
            });
        });
    }

    /**
     * Remove um usuário
     */
    removerUsuario() {
        console.log(chalk.yellow('\n=== REMOVER USUÁRIO ==='));
        
        this.rl.question('Digite o ID do usuário: ', (id) => {
            const usuario = this.gerenciador.buscarPorId(id);
            
            if (!usuario) {
                console.log(chalk.red('\n✗ Usuário não encontrado.'));
                this.voltarMenu();
                return;
            }

            console.log(chalk.yellow(`\nVocê tem certeza que deseja remover o usuário "${usuario.nome}"?`));
            this.rl.question('Digite "SIM" para confirmar: ', (confirmacao) => {
                if (confirmacao.toUpperCase() === 'SIM') {
                    const resultado = this.gerenciador.removerUsuario(id);
                    
                    if (resultado.sucesso) {
                        console.log(chalk.green('\n✓ ' + resultado.mensagem));
                    } else {
                        console.log(chalk.red('\n✗ Erro: ' + resultado.erro));
                    }
                } else {
                    console.log(chalk.gray('\nOperação cancelada.'));
                }

                this.voltarMenu();
            });
        });
    }

    /**
     * Mostra estatísticas do sistema
     */
    mostrarEstatisticas() {
        console.log(chalk.yellow('\n=== ESTATÍSTICAS DO SISTEMA ==='));
        
        const stats = this.gerenciador.obterEstatisticas();
        
        console.log(chalk.cyan(`Total de usuários: ${stats.totalUsuarios}`));
        console.log(chalk.green(`Usuários ativos: ${stats.usuariosAtivos}`));
        console.log(chalk.red(`Usuários inativos: ${stats.usuariosInativos}`));
        
        if (stats.ultimoCadastro) {
            console.log(chalk.gray(`Último cadastro: ${stats.ultimoCadastro}`));
        }

        this.voltarMenu();
    }

    /**
     * Valida um CPF
     */
    validarCPF() {
        console.log(chalk.yellow('\n=== VALIDAR CPF ==='));
        
        this.rl.question('Digite o CPF: ', (cpf) => {
            const validaCPF = require('./cpf');
            const valido = validaCPF(cpf);
            
            if (valido) {
                console.log(chalk.green('\n✓ CPF válido!'));
            } else {
                console.log(chalk.red('\n✗ CPF inválido!'));
            }

            this.voltarMenu();
        });
    }

    /**
     * Volta ao menu principal
     */
    voltarMenu() {
        console.log();
        this.rl.question(chalk.gray('Pressione Enter para continuar...'), () => {
            this.mostrarBanner();
            this.mostrarMenu();
        });
    }

    /**
     * Sai do sistema
     */
    sair() {
        console.log(chalk.green('\nObrigado por usar o Sistema de Gerenciamento de Usuários!'));
        console.log(chalk.gray('Até logo! 👋'));
        this.rl.close();
    }
}

module.exports = InterfaceCLI;

