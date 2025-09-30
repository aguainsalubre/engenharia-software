const SistemaGerenciamentoUsuarios = require('../src/index.js'); // ajuste o caminho conforme necessário

describe("Sistema de Gerenciamento de Usuários - Testes de Integração", () => {
    let sistema;

    beforeEach(() => {
        // Re-inicializa o sistema antes de cada teste
        sistema = new SistemaGerenciamentoUsuarios();
    });

    // ===== Inicialização do Sistema =====
    describe("Inicialização do Sistema", () => {
        test("deve criar instância do sistema corretamente", () => {
            expect(sistema).toBeDefined();
            expect(sistema.obterGerenciador).toBeDefined();
            expect(sistema.executarDemonstracao).toBeDefined();
            expect(sistema.iniciarModoInterativo).toBeDefined();
        });

        test("deve obter gerenciador de usuários", () => {
            const gerenciador = sistema.obterGerenciador();
            expect(gerenciador).toBeDefined();
            expect(gerenciador.adicionarUsuario).toBeDefined();
            expect(gerenciador.listarUsuarios).toBeDefined();
        });
    });

    // ===== Fluxo Completo de Usuário =====
    describe("Fluxo Completo de Usuário", () => {
        test("deve executar fluxo completo: cadastrar, buscar, atualizar e remover", () => {
            const gerenciador = sistema.obterGerenciador();

            const cadastro = gerenciador.adicionarUsuario(
                "João Silva",
                "joao@email.com",
                "123.456.789-09",
                "(11) 99999-1234"
            );
            expect(cadastro.sucesso).toBe(true);
            const usuarioId = cadastro.usuario.id;

            const usuarioEncontrado = gerenciador.buscarPorId(usuarioId);
            expect(usuarioEncontrado.nome).toBe("João Silva");

            const atualizacao = gerenciador.atualizarUsuario(usuarioId, {
                nome: "João Silva Santos",
                telefone: "(11) 88888-5678"
            });
            expect(atualizacao.sucesso).toBe(true);
            expect(atualizacao.usuario.nome).toBe("João Silva Santos");
            expect(atualizacao.usuario.telefone).toBe("(11) 88888-5678");

            const usuarios = gerenciador.listarUsuarios();
            expect(usuarios).toHaveLength(1);
            expect(usuarios[0].nome).toBe("João Silva Santos");

            const remocao = gerenciador.removerUsuario(usuarioId);
            expect(remocao.sucesso).toBe(true);

            const usuariosAposRemocao = gerenciador.listarUsuarios();
            expect(usuariosAposRemocao).toHaveLength(0);
        });

        test("deve manter integridade dos dados durante operações múltiplas", () => {
            const gerenciador = sistema.obterGerenciador();

            const usuarios = [
                { nome: "João", email: "joao@email.com", cpf: "123.456.789-09" },
                { nome: "Maria", email: "maria@email.com", cpf: "987.654.321-00" },
                { nome: "Pedro", email: "pedro@email.com", cpf: "000.000.001-91" }
            ];

            const idsUsuarios = [];
            usuarios.forEach(dadosUsuario => {
                const resultado = gerenciador.adicionarUsuario(
                    dadosUsuario.nome,
                    dadosUsuario.email,
                    dadosUsuario.cpf
                );
                expect(resultado.sucesso).toBe(true);
                idsUsuarios.push(resultado.usuario.id);
            });

            expect(gerenciador.listarUsuarios()).toHaveLength(3);
            expect(gerenciador.buscarPorCPF("123.456.789-09").nome).toBe("João");
            expect(gerenciador.buscarPorEmail("maria@email.com").nome).toBe("Maria");
            expect(gerenciador.buscarPorId(idsUsuarios[2]).nome).toBe("Pedro");

            gerenciador.removerUsuario(idsUsuarios[1]);
            expect(gerenciador.listarUsuarios()).toHaveLength(2);
            expect(gerenciador.buscarPorId(idsUsuarios[0])).toBeDefined();
            expect(gerenciador.buscarPorId(idsUsuarios[2])).toBeDefined();
            expect(gerenciador.buscarPorId(idsUsuarios[1])).toBeNull();
        });
    });

    // ===== Validações de Negócio =====
    describe("Validações de Negócio", () => {
        test("deve impedir cadastro de usuários com dados conflitantes", () => {
            const gerenciador = sistema.obterGerenciador();

            const primeiro = gerenciador.adicionarUsuario(
                "João Silva",
                "joao@email.com",
                "123.456.789-09"
            );
            expect(primeiro.sucesso).toBe(true);

            const segundoCPF = gerenciador.adicionarUsuario(
                "Maria Santos",
                "maria@email.com",
                "123.456.789-09"
            );
            expect(segundoCPF.sucesso).toBe(false);
            expect(segundoCPF.erro).toContain("CPF já cadastrado");

            const segundoEmail = gerenciador.adicionarUsuario(
                "Pedro Silva",
                "joao@email.com",
                "987.654.321-00"
            );
            expect(segundoEmail.sucesso).toBe(false);
            expect(segundoEmail.erro).toContain("Email já cadastrado");
        });

        test("deve validar integridade dos dados durante atualizações", () => {
            const gerenciador = sistema.obterGerenciador();

            const usuario1 = gerenciador.adicionarUsuario(
                "João",
                "joao@email.com",
                "123.456.789-09"
            );
            const usuario2 = gerenciador.adicionarUsuario(
                "Maria",
                "maria@email.com",
                "987.654.321-00"
            );

            const atualizacaoCPF = gerenciador.atualizarUsuario(usuario1.usuario.id, {
                cpf: "987.654.321-00"
            });
            expect(atualizacaoCPF.sucesso).toBe(false);
            expect(atualizacaoCPF.erro).toContain("CPF já cadastrado para outro usuário");

            const atualizacaoEmail = gerenciador.atualizarUsuario(usuario1.usuario.id, {
                email: "maria@email.com"
            });
            expect(atualizacaoEmail.sucesso).toBe(false);
            expect(atualizacaoEmail.erro).toContain("Email já cadastrado para outro usuário");
        });
    });

    // ===== Casos Extremos e Robustez =====
    describe("Casos Extremos e Robustez", () => {
        test("deve lidar com operações em sistema vazio", () => {
            const gerenciador = sistema.obterGerenciador();
            expect(gerenciador.listarUsuarios()).toEqual([]);
            expect(gerenciador.buscarPorId("qualquer-id")).toBeNull();
            expect(gerenciador.buscarPorCPF("123.456.789-09")).toBeNull();
            expect(gerenciador.buscarPorEmail("teste@email.com")).toBeNull();

            const stats = gerenciador.obterEstatisticas();
            expect(stats.totalUsuarios).toBe(0);
            expect(stats.usuariosAtivos).toBe(0);
            expect(stats.usuariosInativos).toBe(0);
            expect(stats.ultimoCadastro).toBeNull();
        });

        test("deve manter consistência após múltiplas operações", () => {
            const gerenciador = sistema.obterGerenciador();

            for (let i = 0; i < 10; i++) {
                gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    `000.000.00${i}-9${i}`
                );
            }
            expect(gerenciador.listarUsuarios()).toHaveLength(10);

            const usuarios = gerenciador.listarUsuarios();
            for (let i = 0; i < 5; i++) {
                gerenciador.removerUsuario(usuarios[i].id);
            }
            expect(gerenciador.listarUsuarios()).toHaveLength(5);

            const stats = gerenciador.obterEstatisticas();
            expect(stats.totalUsuarios).toBe(10);
            expect(stats.usuariosAtivos).toBe(5);
            expect(stats.usuariosInativos).toBe(5);
        });
    });

    // ===== Performance e Escalabilidade =====
    describe("Performance e Escalabilidade", () => {
        test("deve manter performance com muitos usuários", () => {
            const gerenciador = sistema.obterGerenciador();
            const inicio = Date.now();

            for (let i = 0; i < 100; i++) {
                const cpfBase = String(i).padStart(9, '0');
                const cpfCompleto = cpfBase + '09';
                const resultado = gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    cpfCompleto
                );
                expect(resultado.sucesso).toBe(true);
            }

            const tempoTotal = Date.now() - inicio;
            expect(tempoTotal).toBeLessThan(1000);
            expect(gerenciador.listarUsuarios()).toHaveLength(100);
        });

        test("deve manter eficiência nas buscas", () => {
            const gerenciador = sistema.obterGerenciador();

            for (let i = 0; i < 50; i++) {
                const cpfBase = String(i).padStart(9, '0');
                const cpfCompleto = cpfBase + '09';
                gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    cpfCompleto
                );
            }

            const inicio = Date.now();

            for (let i = 0; i < 50; i++) {
                const cpfBase = String(i).padStart(9, '0');
                const cpfCompleto = cpfBase + '09';
                const usuario = gerenciador.buscarPorCPF(cpfCompleto);
                expect(usuario).toBeDefined();
                expect(usuario.nome).toBe(`Usuário ${i}`);
            }

            const tempoTotal = Date.now() - inicio;
            expect(tempoTotal).toBeLessThan(100);
        });
    });

    afterAll(() => {
        if (sistema.rl) sistema.rl.close();
        jest.clearAllTimers();
    });
});
