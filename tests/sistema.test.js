const SistemaGerenciamentoUsuarios = require('../src/index.js'); // ajuste o caminho conforme necessário

// Lista de CPFs válidos para testes
const cpfsValidos = [
    "168.995.350-09",
    "746.824.890-70",
    "121.603.386-21",
    "867.198.881-37",
    "123.456.789-09" // substituído por um CPF válido de teste
];

describe("Sistema de Gerenciamento de Usuários - Testes de Integração", () => {
    let sistema;

    beforeEach(() => {
        sistema = new SistemaGerenciamentoUsuarios();
        console.log("DEBUG -> Resetando sistema");
        sistema.obterGerenciador().reset();
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

            const nomes = ["João", "Maria", "Pedro"];
            const emails = ["joao@email.com", "maria@email.com", "pedro@email.com"];
            const idsUsuarios = [];

            nomes.forEach((nome, index) => {
                const resultado = gerenciador.adicionarUsuario(
                    nome,
                    emails[index],
                    cpfsValidos[index]
                );
                expect(resultado.sucesso).toBe(true);
                idsUsuarios.push(resultado.usuario.id);
            });

            expect(gerenciador.listarUsuarios()).toHaveLength(3);
            expect(gerenciador.buscarPorCPF(cpfsValidos[0]).nome).toBe("João");
            expect(gerenciador.buscarPorEmail(emails[1]).nome).toBe("Maria");
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
                cpfsValidos[0]
            );
            expect(primeiro.sucesso).toBe(true);

            const segundoCPF = gerenciador.adicionarUsuario(
                "Maria Santos",
                "maria@email.com",
                cpfsValidos[0]
            );
            expect(segundoCPF.sucesso).toBe(false);
            expect(segundoCPF.erro).toContain("CPF já cadastrado");

            const segundoEmail = gerenciador.adicionarUsuario(
                "Pedro Silva",
                "joao@email.com",
                cpfsValidos[1]
            );
            expect(segundoEmail.sucesso).toBe(false);
            expect(segundoEmail.erro).toContain("Email já cadastrado");
        });

        test("deve validar integridade dos dados durante atualizações", () => {
            const gerenciador = sistema.obterGerenciador();

            const usuario1 = gerenciador.adicionarUsuario(
                "João",
                "joao@email.com",
                cpfsValidos[0]
            );
            const usuario2 = gerenciador.adicionarUsuario(
                "Maria",
                "maria@email.com",
                cpfsValidos[1]
            );

            const atualizacaoCPF = gerenciador.atualizarUsuario(usuario1.usuario.id, {
                cpf: cpfsValidos[1]
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
            expect(gerenciador.buscarPorCPF(cpfsValidos[0])).toBeNull();
            expect(gerenciador.buscarPorEmail("teste@email.com")).toBeNull();

            const stats = gerenciador.obterEstatisticas();
            expect(stats.totalUsuarios).toBe(0);
            expect(stats.usuariosAtivos).toBe(0);
            expect(stats.usuariosInativos).toBe(0);
            expect(stats.ultimoCadastro).toBeNull();
        });

        test("deve manter consistência após múltiplas operações", () => {
            const gerenciador = sistema.obterGerenciador();

            for (let i = 0; i < 5; i++) {
                const resultado = gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    cpfsValidos[i]
                );
                console.log("DEBUG -> Tentando adicionar usuário:", {
                    nome: `Usuário ${i}`,
                    email: `usuario${i}@email.com`,
                    cpf: cpfsValidos[i],
                    telefone: null
                });
                expect(resultado.sucesso).toBe(true);
            }
            expect(gerenciador.listarUsuarios()).toHaveLength(5);

            const usuarios = gerenciador.listarUsuarios();
            for (let i = 0; i < 2; i++) { // removendo 2 usuários
                gerenciador.removerUsuario(usuarios[i].id);
            }
            expect(gerenciador.listarUsuarios()).toHaveLength(3);

            const stats = gerenciador.obterEstatisticas();
            expect(stats.totalUsuarios).toBe(5);
            expect(stats.usuariosAtivos).toBe(3);
            expect(stats.usuariosInativos).toBe(2);
        });
    });

    // ===== Performance e Escalabilidade =====
    describe("Performance e Escalabilidade", () => {
        test("deve manter performance com muitos usuários", () => {
            const gerenciador = sistema.obterGerenciador();
            const inicio = Date.now();

            for (let i = 0; i < 5; i++) {
                const resultado = gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    cpfsValidos[i]
                );
                expect(resultado.sucesso).toBe(true);
            }

            const tempoTotal = Date.now() - inicio;
            expect(tempoTotal).toBeLessThan(1000);
            expect(gerenciador.listarUsuarios()).toHaveLength(5);
        });

        test("deve manter eficiência nas buscas", () => {
            const gerenciador = sistema.obterGerenciador();

            for (let i = 0; i < 5; i++) {
                const resultado = gerenciador.adicionarUsuario(
                    `Usuário ${i}`,
                    `usuario${i}@email.com`,
                    cpfsValidos[i]
                );
                expect(resultado.sucesso).toBe(true);
            }

            const inicio = Date.now();

            for (let i = 0; i < 5; i++) {
                const usuario = gerenciador.buscarPorCPF(cpfsValidos[i]);
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
