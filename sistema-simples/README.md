# Sistema Simples

Sistema demonstrativo de gerenciamento de dependências e build automatizado com npm.

## Dependências Externas

- **axios**: Cliente HTTP para APIs
- **moment**: Manipulação de datas
- **chalk**: Estilização de console

## Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Executar aplicação
npm start

# Build completo
npm run build

# Limpar projeto
npm run clean

# Desenvolvimento com auto-reload
npx nodemon src/index.js