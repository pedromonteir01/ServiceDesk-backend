# Service Desk

Esta API tem como objetivo fazer o controle do sistema de solicitações de manutenção. Conseguindo criar, editar e excluir as solicitações e os usuários.

A proposta foi idealizada pelo Coordenador técnico do SENAI VALINHOS e tem como objetivo auxiliar o coordenador predial nas manutenções diárias e assegurar o controle da infraestrutura.

## Configuração do Projeto ⚙

1. **Clonar o repositório:**
```
git clone https://github.com/pedromonteir01/ServiceDesk-backend.git
```
2. **Instalar dependências:**
```
npm install
```
3. **Configurar o banco de dados:** 
- Crie um banco de dados PostgreSQL com o nome 'bflow':
  ```
  CREATE DATABASE bflow;
  ```
- Ajuste as credenciais do banco de dados no arquivo `server.js`, se necessário.

## Estrutura de arquivos

O projeto segue uma organização lógica de arquivos, facilitando a manutenção e a compreensão do código:

```
ServiceDesk-backend/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── routes/
└── server.js
```

## Tecnologias
Nossa aplicação foi desenvolvida com base no ECMAscript (Javascript), optamos pelo uso do **_[Node.JS](https://nodejs.org/pt)_** como runtime da aplicação pela eficiência e escalabilidade do motor _V8_. Nosso gerenciador de pacotes foi o _NPM_.

Além disso contamos com o arquivo .env que faz o controle das variáveis sensíveis.

### Bibliotecas
Para funcionamento total do projeto contamos com o uso de bibliotecas que facilitam a estruturação:

- [x] [Express](https://expressjs.com/)
- Estrutura as rotas HTTP

- [x] [Dotenv](https://www.npmjs.com/package/dotenv)
- Configura o controle de variáveis sensíveis e integra o arquivo .env

- [x] [Nodemon](https://nodemon.io/)
- Atualiza o código e reinicia a aplicação automaticamente

- [x] [PG](https://www.npmjs.com/package/pg)
- Faz a conexão com o banco de dados em PostgreSQL

- [x] [JWT (JSON Web Token)](https://www.npmjs.com/package/jsonwebtoken)
- Gera Tokens para login de usuários


# Documentação das Rotas da API

Este projeto contém rotas para gerenciar usuários e solicitações em uma API construída com o framework **Express.js**.

## Estrutura de Rotas

### 1. **Rotas de Request (`request.routes.js`)**

As rotas de solicitações são simples e usadas para responder a requisições HTTP feitas ao endpoint `/request`.

#### Endpoints:

- **GET `/request/`** 
  - **Descrição**: Responde com a mensagem "Request route".
  - **Exemplo de Resposta**: 
    ```json
    {
      "message": "Request route"
    }
    ```

#### Exemplo de Uso:

Realizando uma requisição GET para `/request/`:

```bash
curl http://localhost:<PORT>/request
```

---

### 2. **Rotas de Usuário (`user.routes.js`)**

As rotas de usuário gerenciam a criação, leitura, atualização e exclusão de usuários na API. Estas rotas estão vinculadas a um controlador (`usersController`) que contém a lógica necessária para cada operação.

#### Endpoints:

- **GET `/user`** 
  - **Descrição**: Retorna todos os usuários do sistema. 
  - **Exemplo de Resposta**: 
    ```json
    [
      {
        "name": "John Doe",
        "email": "johndoe@example.com"
      },
      ...
    ]
    ```

- **POST `/user`** 
  - **Descrição**: Cria um novo usuário com base nos dados fornecidos no corpo da requisição. 
  - **Dados de Exemplo (Body)**: 
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
    ```

- **PUT `/user/:email`** 
  - **Descrição**: Atualiza as informações de um usuário existente identificado por seu email. 
  - **Parâmetro de URL**: `email` - o email do usuário a ser atualizado.
  - **Dados de Exemplo (Body)**: 
    ```json
    {
      "name": "Jane Doe"
    }
    ```

- **GET `/user/:name`** 
  - **Descrição**: Retorna os detalhes de um usuário específico baseado em seu nome. 
  - **Parâmetro de URL**: `name` - o nome do usuário.

- **GET `/user/:email`** 
  - **Descrição**: Retorna os detalhes de um usuário específico baseado em seu email. 
  - **Parâmetro de URL**: `email` - o email do usuário.

- **DELETE `/user/:email`** 
  - **Descrição**: Exclui um usuário específico baseado em seu email. 
  - **Parâmetro de URL**: `email` - o email do usuário.

#### Exemplo de Uso:

- Criar um novo usuário (POST):
 
  ```bash
  curl -X POST http://localhost:<PORT>/user \
    -H "Content-Type: application/json" \
    -d '{"name": "John Doe", "email": "johndoe@example.com"}'
  ```

- Atualizar um usuário existente (PUT):
 
  ```bash
  curl -X PUT http://localhost:<PORT>/user/johndoe@example.com \
    -H "Content-Type: application/json" \
    -d '{"name": "Jane Doe"}'
  ```

- Obter um usuário por email (GET):

  ```bash
  curl http://localhost:<PORT>/user/johndoe@example.com
  ```

- Excluir um usuário por email (DELETE):

  ```bash
  curl -X DELETE http://localhost:<PORT>/user/johndoe@example.com
  ```

---

### Observações

- Certifique-se de que o servidor Express está em execução para poder realizar as requisições HTTP.
- Substitua `<PORT>` pela porta na qual o servidor está configurado para rodar.