# Chat App

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE4C00?style=flat-square&logo=typeorm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=websocket&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

## Sumário

- [Resumo](#resumo)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)

## Resumo

O **Chat App** é uma aplicação de chat desenvolvida para gerenciar usuários e conversas em tempo real. A aplicação permite a autenticação de usuários com três tipos de roles: `admin`, `enduser` e `employee`. Além disso, fornece funcionalidades de chat para salvar e pesquisar conversas.
Utilizamos o **UserGuard**, **Jwt** e **Passport** para garantir a segurança e a autenticação dos usuários.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construir aplicações do lado do servidor.
- **TypeORM**: ORM para interação com bancos de dados.
- **Docker**: Plataforma para criação e gerenciamento de contêineres.
- **MySQL**: Sistema de gerenciamento de banco de dados relacional.
- **WebSocket**: Protocolo de comunicação para aplicações em tempo real.
- **Swagger**: Ferramenta para documentar APIs RESTful.
- **ESLint**: Ferramenta para análise estática de código e formatação.
- **Jest**: Framework de testes em JavaScript.

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

Além disso, é recomendável usar um bom editor de texto, como o [VSCode](https://code.visualstudio.com/).

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/WilkRhu/chat-application
   cd chat-app

Instale as dependências:

npm install
Configure o ambiente criando um arquivo .env baseado no .env.example.

Execução
Para iniciar a aplicação usando Docker, execute o seguinte comando:

docker-compose up
Isso iniciará a aplicação junto com o banco de dados MySQL em contêineres Docker.

Se você preferir rodar a aplicação localmente, sem Docker:

npm run start
A aplicação estará disponível em http://localhost:3001.

Documentação da API
A documentação da API está disponível via Swagger. Após iniciar a aplicação, acesse:

http://localhost:3001/api

## Testes
Para rodar os testes, utilize o seguinte comando:

npm run test
Este comando executará todos os testes escritos com Jest. Para rodar os testes em modo watch:

npm run test:watch
Formatação de Código
Para garantir que o código está formatado corretamente de acordo com as regras do ESLint, execute:

npm run lint
Caso precise corrigir automaticamente os problemas encontrados:

npm run lint:fix

## Execução

Usando Docker
A aplicação já possui uma configuração para ser executada usando Docker e Docker Compose. Siga os passos abaixo para rodar a aplicação em contêineres Docker:

Certifique-se de que o Docker e o Docker Compose estão instalados em sua máquina.

Inicie a aplicação com o Docker Compose:

bash
Copiar código
docker-compose up
Este comando irá criar e iniciar os contêineres para a aplicação e o banco de dados MySQL.

A aplicação estará disponível em http://localhost:3001.