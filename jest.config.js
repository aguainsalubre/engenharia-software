module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Padrão de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Cobertura de código
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/interface.js', // Excluir interface CLI dos testes de cobertura
    '!**/node_modules/**'
  ],

  // Relatórios de cobertura
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Diretório de saída da cobertura
  coverageDirectory: 'coverage',

  // Limite mínimo de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Configurações de exibição
  verbose: true,

  // Limpar mocks automaticamente
  clearMocks: true,

  // Timeout para testes
  testTimeout: 10000
};

