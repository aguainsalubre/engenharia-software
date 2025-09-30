const axios = require('axios');
const moment = require('moment');
const chalk = require('chalk').default || require('chalk');

class SistemaSimples {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
    }

    async buscarDadosUsuario(userId) {
        try {
            console.log(chalk.blue(`Buscando dados do usuário ${userId}...`));
            
            const response = await axios.get(`${this.baseURL}/users/${userId}`);
            const usuario = response.data;
            
            console.log(chalk.bold.green('Dados obtidos com sucesso!'));
            console.log(chalk.yellow('--- Informações do Usuário ---'));
            console.log(`Nome: ${chalk.bold(usuario.name)}`);
            console.log(`Email: ${usuario.email}`);
            console.log(`Empresa: ${usuario.company?.name || 'N/A'}`);
            
            return usuario;
        } catch (error) {
            console.error(chalk.red('Erro ao buscar dados:'), error.message);
            throw error;
        }
    }

    async listarPostsUsuario(userId) {
        try {
            console.log(chalk.blue(`\nBuscando posts do usuário ${userId}...`));
            
            const response = await axios.get(`${this.baseURL}/posts?userId=${userId}`);
            const posts = response.data;
            
            console.log(chalk.bold.green(`Encontrados ${posts.length} posts!`));
            
            posts.forEach((post, index) => {
                console.log(chalk.cyan(`\nPost ${index + 1}:`));
                console.log(`Título: ${chalk.bold(post.title)}`);
                console.log(`Corpo: ${post.body.substring(0, 50)}...`);
            });
            
            return posts;
        } catch (error) {
            console.error(chalk.red('Erro ao buscar posts:'), error.message);
            throw error;
        }
    }

    mostrarDataHora() {
        const agora = moment();
        console.log(chalk.magenta(`\nData e hora atual: ${agora.format('DD/MM/YYYY HH:mm:ss')}`));
        console.log(`Timestamp: ${agora.valueOf()}`);
    }
}

// Função principal
async function main() {
    console.log(chalk.bold.green('=== Sistema Simples ==='));
    console.log(chalk.gray('Iniciando aplicação...\n'));
    
    const sistema = new SistemaSimples();
    
    try {
        // Buscar dados do usuário 1
        await sistema.buscarDadosUsuario(1);
        
        // Listar posts do usuário 1
        await sistema.listarPostsUsuario(1);
        
        // Mostrar data e hora
        sistema.mostrarDataHora();
        
        console.log(chalk.bold.green('\n=== Execução concluída com sucesso! ==='));
        
    } catch (error) {
        console.error(chalk.red.bold('\n=== Erro durante a execução ==='));
        process.exit(1);
    }
}

// Executar se for o arquivo principal
if (require.main === module) {
    main();
}

module.exports = SistemaSimples;