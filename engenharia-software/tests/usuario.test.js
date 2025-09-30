const { Usuario, GerenciadorUsuarios } = require('../src/usuario');

describe('Classe Usuario', () => {
    test('deve criar um usuário com dados válidos', () => {
        const usuario = new Usuario('João Silva', 'joao@email.com', '123.456.789-09', '(11) 99999-1234');
        
        expect(usuario.nome).toBe('João Silva');
        expect(usuario.email).toBe('joao@email.com');
        expect(usuario.cpf).toBe('123.456.789-09');
        expect(usuario.telefone).toBe('(11) 99999-1234');
        expect(usuario.ativo).toBe(true);
        expect(usuario.id).toBeDefined();
        expect(usuario.dataCadastro).toBeDefined();
    });

    test('deve criar usuário sem telefone', () => {
        const usuario = new Usuario('Maria Santos', 'maria@email.com', '987.654.321-00');
        
        expect(usuario.telefone).toBeNull();
    });

    test('deve gerar ID único para cada usuário', () => {
        const usuario1 = new Usuario('João', 'joao@email.com', '123.456.789-09');
        const usuario2 = new Usuario('Maria', 'maria@email.com', '987.654.321-00');
        
        expect(usuario1.id).not.toBe(usuario2.id);
    });

    test('deve converter para JSON corretamente', () => {
        const usuario = new Usuario('João Silva', 'joao@email.com', '123.456.789-09');
        const json = usuario.toJSON();
        
        expect(json).toHaveProperty('id');
        expect(json).toHaveProperty('nome', 'João Silva');
        expect(json).toHaveProperty('email', 'joao@email.com');
        expect(json).toHaveProperty('cpf', '123.456.789-09');
        expect(json).toHaveProperty('dataCadastro');
        expect(json).toHaveProperty('ativo', true);
    });
});

describe('Classe GerenciadorUsuarios', () => {
    let gerenciador;

    beforeEach(() => {
        gerenciador = new GerenciadorUsuarios();
    });

    describe('Adicionar Usuário - Casos Positivos', () => {
        test('deve adicionar usuário com dados válidos', () => {
            const resultado = gerenciador.adicionarUsuario(
                'João Silva',
                'joao@email.com',
                '123.456.789-09',
                '(11) 99999-1234'
            );

            expect(resultado.sucesso).toBe(true);
            expect(resultado.usuario).toBeDefined();
            expect(resultado.usuario.nome).toBe('João Silva');
            expect(resultado.mensagem).toBe('Usuário cadastrado com sucesso');
        });

        test('deve adicionar usuário sem telefone', () => {
            const resultado = gerenciador.adicionarUsuario(
                'Maria Santos',
                'maria@email.com',
                '987.654.321-00'
            );

            expect(resultado.sucesso).toBe(true);
            expect(resultado.usuario.telefone).toBeNull();
        });
    });

    describe('Adicionar Usuário - Casos Negativos', () => {
        test('deve rejeitar nome muito curto', () => {
            const resultado = gerenciador.adicionarUsuario(
                'J',
                'joao@email.com',
                '123.456.789-09'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Nome deve ter pelo menos 2 caracteres');
        });

        test('deve rejeitar nome vazio', () => {
            const resultado = gerenciador.adicionarUsuario(
                '',
                'joao@email.com',
                '123.456.789-09'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Nome deve ter pelo menos 2 caracteres');
        });

        test('deve rejeitar email inválido', () => {
            const resultado = gerenciador.adicionarUsuario(
                'João Silva',
                'email-invalido',
                '123.456.789-09'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Email inválido');
        });

        test('deve rejeitar CPF inválido', () => {
            const resultado = gerenciador.adicionarUsuario(
                'João Silva',
                'joao@email.com',
                '111.111.111-11'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('CPF inválido');
        });

        test('deve rejeitar CPF duplicado', () => {
            // Adicionar primeiro usuário
            gerenciador.adicionarUsuario(
                'João Silva',
                'joao@email.com',
                '123.456.789-09'
            );

            // Tentar adicionar segundo usuário com mesmo CPF
            const resultado = gerenciador.adicionarUsuario(
                'Maria Santos',
                'maria@email.com',
                '123.456.789-09'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('CPF já cadastrado no sistema');
        });

        test('deve rejeitar email duplicado', () => {
            // Adicionar primeiro usuário
            gerenciador.adicionarUsuario(
                'João Silva',
                'joao@email.com',
                '123.456.789-09'
            );

            // Tentar adicionar segundo usuário com mesmo email
            const resultado = gerenciador.adicionarUsuario(
                'Maria Santos',
                'joao@email.com',
                '987.654.321-00'
            );

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Email já cadastrado no sistema');
        });
    });

    describe('Listar Usuários', () => {
        test('deve retornar lista vazia quando não há usuários', () => {
            const usuarios = gerenciador.listarUsuarios();
            expect(usuarios).toEqual([]);
        });

        test('deve listar usuários cadastrados', () => {
            gerenciador.adicionarUsuario('João', 'joao@email.com', '123.456.789-09');
            gerenciador.adicionarUsuario('Maria', 'maria@email.com', '987.654.321-00');

            const usuarios = gerenciador.listarUsuarios();
            expect(usuarios).toHaveLength(2);
            expect(usuarios[0].nome).toBe('João');
            expect(usuarios[1].nome).toBe('Maria');
        });

        test('deve listar apenas usuários ativos', () => {
            const resultado1 = gerenciador.adicionarUsuario('João', 'joao@email.com', '123.456.789-09');
            gerenciador.adicionarUsuario('Maria', 'maria@email.com', '987.654.321-00');
            
            // Remover primeiro usuário
            gerenciador.removerUsuario(resultado1.usuario.id);

            const usuarios = gerenciador.listarUsuarios();
            expect(usuarios).toHaveLength(1);
            expect(usuarios[0].nome).toBe('Maria');
        });
    });

    describe('Buscar Usuários', () => {
        beforeEach(() => {
            gerenciador.adicionarUsuario('João Silva', 'joao@email.com', '123.456.789-09');
            gerenciador.adicionarUsuario('Maria Santos', 'maria@email.com', '987.654.321-00');
        });

        test('deve buscar usuário por ID válido', () => {
            const usuarios = gerenciador.listarUsuarios();
            const usuario = gerenciador.buscarPorId(usuarios[0].id);
            
            expect(usuario).toBeDefined();
            expect(usuario.nome).toBe('João Silva');
        });

        test('deve retornar null para ID inexistente', () => {
            const usuario = gerenciador.buscarPorId('id-inexistente');
            expect(usuario).toBeNull();
        });

        test('deve buscar usuário por CPF', () => {
            const usuario = gerenciador.buscarPorCPF('123.456.789-09');
            
            expect(usuario).toBeDefined();
            expect(usuario.nome).toBe('João Silva');
        });

        test('deve buscar usuário por CPF sem formatação', () => {
            const usuario = gerenciador.buscarPorCPF('12345678909');
            
            expect(usuario).toBeDefined();
            expect(usuario.nome).toBe('João Silva');
        });

        test('deve buscar usuário por email', () => {
            const usuario = gerenciador.buscarPorEmail('maria@email.com');
            
            expect(usuario).toBeDefined();
            expect(usuario.nome).toBe('Maria Santos');
        });

        test('deve buscar usuário por email case-insensitive', () => {
            const usuario = gerenciador.buscarPorEmail('MARIA@EMAIL.COM');
            
            expect(usuario).toBeDefined();
            expect(usuario.nome).toBe('Maria Santos');
        });
    });

    describe('Remover Usuário', () => {
        test('deve remover usuário existente', () => {
            const resultado = gerenciador.adicionarUsuario('João', 'joao@email.com', '123.456.789-09');
            const remocao = gerenciador.removerUsuario(resultado.usuario.id);

            expect(remocao.sucesso).toBe(true);
            expect(remocao.mensagem).toBe('Usuário removido com sucesso');

            const usuario = gerenciador.buscarPorId(resultado.usuario.id);
            expect(usuario).toBeNull();
        });

        test('deve falhar ao remover usuário inexistente', () => {
            const resultado = gerenciador.removerUsuario('id-inexistente');

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Usuário não encontrado');
        });
    });

    describe('Atualizar Usuário', () => {
        let usuarioId;

        beforeEach(() => {
            const resultado = gerenciador.adicionarUsuario('João', 'joao@email.com', '123.456.789-09');
            usuarioId = resultado.usuario.id;
        });

        test('deve atualizar nome do usuário', () => {
            const resultado = gerenciador.atualizarUsuario(usuarioId, { nome: 'João Silva' });

            expect(resultado.sucesso).toBe(true);
            expect(resultado.usuario.nome).toBe('João Silva');
        });

        test('deve atualizar email do usuário', () => {
            const resultado = gerenciador.atualizarUsuario(usuarioId, { email: 'joao.silva@email.com' });

            expect(resultado.sucesso).toBe(true);
            expect(resultado.usuario.email).toBe('joao.silva@email.com');
        });

        test('deve rejeitar atualização com nome muito curto', () => {
            const resultado = gerenciador.atualizarUsuario(usuarioId, { nome: 'J' });

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Nome deve ter pelo menos 2 caracteres');
        });

        test('deve rejeitar atualização com email inválido', () => {
            const resultado = gerenciador.atualizarUsuario(usuarioId, { email: 'email-invalido' });

            expect(resultado.sucesso).toBe(false);
            expect(resultado.erro).toBe('Email inválido');
        });
    });

    describe('Validação de Email', () => {
        test('deve validar emails corretos', () => {
            expect(gerenciador.validarEmail('teste@email.com')).toBe(true);
            expect(gerenciador.validarEmail('usuario.teste@dominio.com.br')).toBe(true);
            expect(gerenciador.validarEmail('123@teste.org')).toBe(true);
        });

        test('deve rejeitar emails incorretos', () => {
            expect(gerenciador.validarEmail('email-sem-arroba')).toBe(false);
            expect(gerenciador.validarEmail('@dominio.com')).toBe(false);
            expect(gerenciador.validarEmail('usuario@')).toBe(false);
            expect(gerenciador.validarEmail('usuario@dominio')).toBe(false);
        });
    });

    describe('Estatísticas', () => {
        test('deve retornar estatísticas corretas', () => {
            gerenciador.adicionarUsuario('João', 'joao@email.com', '123.456.789-09');
            const resultado = gerenciador.adicionarUsuario('Maria', 'maria@email.com', '987.654.321-00');
            gerenciador.removerUsuario(resultado.usuario.id);

            const stats = gerenciador.obterEstatisticas();

            expect(stats.totalUsuarios).toBe(2);
            expect(stats.usuariosAtivos).toBe(1);
            expect(stats.usuariosInativos).toBe(1);
            expect(stats.ultimoCadastro).toBeDefined();
        });
    });
});

