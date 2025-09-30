#!/bin/bash

# Cria o diretório de build se não existir
mkdir -p build

# Copia os arquivos essenciais para o diretório de build
cp -r src build/
cp package.json build/
cp package-lock.json build/

echo "Build concluído! Arquivos empacotados em ./build"

