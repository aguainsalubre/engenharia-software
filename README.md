Sistema de Gerenciamento de Usuários

Sistema demonstrativo de gerenciamento de usuários com validação de CPF integrada, desenvolvido para demonstrar boas práticas de engenharia de software e gerenciamento de dependências com npm.

🚀 Funcionalidades

•
Gerenciamento completo de usuários: Cadastro, listagem, busca, atualização e remoção

•
Validação de CPF integrada: Utiliza algoritmo oficial de validação de CPF brasileiro

•
Interface de linha de comando (CLI): Interface interativa e amigável

•
Modo demonstração: Execução automatizada para apresentar as funcionalidades

•
Busca avançada: Busca por ID, CPF ou email

•
Estatísticas do sistema: Relatórios sobre usuários cadastrados

•
Validação de dados: Verificação de email, CPF e dados obrigatórios

📋 Dependências

•
chalk: Estilização e colorização do console

•
moment: Manipulação e formatação de datas

•
readline: Interface de linha de comando (nativo do Node.js)

🛠️ Comandos Disponíveis

Bash


# Instalar dependências
npm install

# Executar aplicação em modo interativo
npm start

# Executar demonstração automatizada
npm run demo

# Build completo
npm run build

# Limpar projeto
npm run clean

# Desenvolvimento com auto-reload
npm run dev


🎯 Como Usar

Modo Interativo

Execute npm start para iniciar a interface interativa onde você pode:

•
Cadastrar novos usuários

•
Listar todos os usuários

•
Buscar usuários específicos

•
Atualizar dados de usuários

•
Remover usuários

•
Ver estatísticas do sistema

•
Validar CPFs

Modo Demonstração

Execute npm run demo para ver uma demonstração automatizada das funcionalidades principais.

📝 Validação de CPF

O sistema inclui um módulo robusto de validação de CPF desenvolvido com TDD (Desenvolvimento Orientado a Testes). A validação implementa:

•
Remoção de formatações (pontos e traços)

•
Verificação de 11 dígitos

•
Rejeição de CPFs com todos os dígitos iguais

•
Validação dos dois dígitos verificadores através do algoritmo oficial

Exemplo de uso da validação:

JavaScript


const validaCPF = require('./src/cpf');

console.log(validaCPF('123.456.789-09')); // true (se for um CPF válido)
console.log(validaCPF('111.111.111-11')); // false (todos os dígitos iguais)


🏗️ Arquitetura do Sistema

O sistema foi reestruturado para seguir boas práticas de engenharia de software:

Estrutura de Arquivos

Plain Text


src/
├── index.js        # Ponto de entrada principal
├── usuario.js      # Módulo de gerenciamento de usuários
├── interface.js    # Interface de linha de comando
└── cpf.js         # Módulo de validação de CPF


Módulos Principais

•
usuario.js: Contém as classes Usuario e GerenciadorUsuarios responsáveis pela lógica de negócio

•
interface.js: Implementa a interface CLI com menus interativos

•
cpf.js: Módulo de validação de CPF (mantido da versão anterior)

•
index.js: Orquestra o sistema e oferece modos de execução

🔄 Melhorias Implementadas

Versão 2.0 - Principais mudanças:

1.
Integração lógica: A validação de CPF agora é parte integrante do sistema de usuários

2.
Interface melhorada: CLI interativa com menus e navegação

3.
Modularização: Código organizado em módulos específicos

4.
Funcionalidades CRUD: Operações completas de Create, Read, Update, Delete

5.
Validações robustas: Verificação de email, CPF e dados duplicados

6.
Modo demonstração: Apresentação automatizada das funcionalidades

7.
Remoção de dependências desnecessárias: Removido axios que não tinha propósito no contexto

🧪 Desenvolvimento com TDD

O módulo de validação de CPF foi desenvolvido seguindo a metodologia TDD:

1.
Red: Testes escritos antes da implementação

2.
Green: Código implementado para passar nos testes

3.
Refactor: Código refinado mantendo os testes passando

📊 Exemplo de Uso

JavaScript


const SistemaGerenciamentoUsuarios = require('./src/index');

const sistema = new SistemaGerenciamentoUsuarios();
const gerenciador = sistema.obterGerenciador();

// Cadastrar usuário
const resultado = gerenciador.adicionarUsuario(
    'João Silva',
    'joao@email.com',
    '123.456.789-09',
    '(11) 99999-1234'
);

if (resultado.sucesso) {
    console.log('Usuário cadastrado:', resultado.usuario);
}


🎨 Características Visuais

•
Interface colorizada com chalk

•
Menus organizados e intuitivos

•
Feedback visual para operações (✓ sucesso, ✗ erro)

•
Banner personalizado do sistema

•
Formatação clara de dados

🔧 Requisitos

•
Node.js 12.0 ou superior

•
npm 6.0 ou superior

📄 Licença

ISC License - Projeto educacional para demonstração de conceitos de engenharia de software.

