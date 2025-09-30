const validaCPF = require('./cpf');
const moment = require('moment');

/**
 * Classe para representar um usuário do sistema
 */
class Usuario {
    constructor(nome, email, cpf, telefone = null) {
        this.id = this.gerarId();
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataCadastro = moment().format('DD/MM/YYYY HH:mm:ss');
        this.ativo = true;
    }

    gerarId() {
        return Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            cpf: this.cpf,
            telefone: this.telefone,
            dataCadastro: this.dataCadastro,
            ativo: this.ativo
        };
    }
}

/**
 * Classe para gerenciar usuários do sistema
 */
class GerenciadorUsuarios {
    constructor() {
        this.usuarios = [];
    }

    /**
     * Adiciona um novo usuário ao sistema
     */
    adicionarUsuario(nome, email, cpf, telefone = null) {
        // Validações
        if (!nome || nome.trim().length < 2) {
            return { sucesso: false, erro: 'Nome deve ter pelo menos 2 caracteres' };
        }

        if (!email || !this.validarEmail(email)) {
            return { sucesso: false, erro: 'Email inválido' };
        }

        if (!cpf || !validaCPF(cpf)) {
            return { sucesso: false, erro: 'CPF inválido' };
        }

        // Verificar se CPF já existe
        if (this.buscarPorCPF(cpf)) {
            return { sucesso: false, erro: 'CPF já cadastrado no sistema' };
        }

        // Verificar se email já existe
        if (this.buscarPorEmail(email)) {
            return { sucesso: false, erro: 'Email já cadastrado no sistema' };
        }

        const usuario = new Usuario(nome, email, cpf, telefone);
        this.usuarios.push(usuario);

        return {
            sucesso: true,
            usuario: usuario.toJSON(),
            mensagem: 'Usuário cadastrado com sucesso'
        };
    }

    listarUsuarios() {
        return this.usuarios.filter(usuario => usuario.ativo).map(usuario => usuario.toJSON());
    }

    buscarPorId(id) {
        const usuario = this.usuarios.find(u => u.id === id && u.ativo);
        return usuario ? usuario.toJSON() : null;
    }

    buscarPorCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, '');
        const usuario = this.usuarios.find(u => u.cpf.replace(/\D/g, '') === cpfLimpo && u.ativo);
        return usuario ? usuario.toJSON() : null;
    }

    buscarPorEmail(email) {
        const usuario = this.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.ativo);
        return usuario ? usuario.toJSON() : null;
    }

    removerUsuario(id) {
        const usuario = this.usuarios.find(u => u.id === id && u.ativo);

        if (!usuario) {
            return { sucesso: false, erro: 'Usuário não encontrado' };
        }

        usuario.ativo = false;
        return { sucesso: true, mensagem: 'Usuário removido com sucesso' };
    }

    atualizarUsuario(id, dadosAtualizacao) {
        const usuario = this.usuarios.find(u => u.id === id && u.ativo);

        if (!usuario) {
            return { sucesso: false, erro: 'Usuário não encontrado' };
        }

        // Validações
        if (dadosAtualizacao.nome && dadosAtualizacao.nome.trim().length < 2) {
            return { sucesso: false, erro: 'Nome deve ter pelo menos 2 caracteres' };
        }

        if (dadosAtualizacao.email && !this.validarEmail(dadosAtualizacao.email)) {
            return { sucesso: false, erro: 'Email inválido' };
        }

        if (dadosAtualizacao.cpf && !validaCPF(dadosAtualizacao.cpf)) {
            return { sucesso: false, erro: 'CPF inválido' };
        }

        if (dadosAtualizacao.cpf) {
            const usuarioComCPF = this.buscarPorCPF(dadosAtualizacao.cpf);
            if (usuarioComCPF && usuarioComCPF.id !== id) {
                return { sucesso: false, erro: 'CPF já cadastrado para outro usuário' };
            }
        }

        if (dadosAtualizacao.email) {
            const usuarioComEmail = this.buscarPorEmail(dadosAtualizacao.email);
            if (usuarioComEmail && usuarioComEmail.id !== id) {
                return { sucesso: false, erro: 'Email já cadastrado para outro usuário' };
            }
        }

        // Atualizar
        if (dadosAtualizacao.nome) usuario.nome = dadosAtualizacao.nome;
        if (dadosAtualizacao.email) usuario.email = dadosAtualizacao.email;
        if (dadosAtualizacao.cpf) usuario.cpf = dadosAtualizacao.cpf;
        if (dadosAtualizacao.telefone !== undefined) usuario.telefone = dadosAtualizacao.telefone;

        return {
            sucesso: true,
            usuario: usuario.toJSON(),
            mensagem: 'Usuário atualizado com sucesso'
        };
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    obterEstatisticas() {
        const usuariosAtivos = this.usuarios.filter(u => u.ativo);
        const usuariosInativos = this.usuarios.filter(u => !u.ativo);

        return {
            totalUsuarios: this.usuarios.length,
            usuariosAtivos: usuariosAtivos.length,
            usuariosInativos: usuariosInativos.length,
            ultimoCadastro: usuariosAtivos.length > 0 ?
                usuariosAtivos[usuariosAtivos.length - 1].dataCadastro : null
        };
    }

    reset() {
        this.usuarios = [];
        return true;
    }
}

module.exports = { Usuario, GerenciadorUsuarios };
