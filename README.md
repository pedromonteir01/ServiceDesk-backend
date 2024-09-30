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


# Documentação das Rotas da API - Service Desk

Este projeto consiste em uma API para gerenciar usuários e solicitações de manutenção de patrimônios escolar quebrados, desenvolvida com **Express.js**. Usuários podem criar contas, enviar fotos e descrever problemas encontrados na rede SENAI.

## Estrutura de Rotas

### 1. **Rotas de Solicitação (`request.routes.js`)**

As rotas de solicitação permitem o envio e gerenciamento de reportes de monumentos quebrados na escola.

#### Endpoints:

- **GET `/request/`** 
  - **Descrição**: Retorna uma lista de todas as solicitações de manutenção cadastradas.
  - **Exemplo de Resposta**: 
    ```json
    [
      {
        "id": 1,
        "title": "Ventilador",
        "image": "http://example.com/imagem1.jpg",
        "description": "Grade pendurada",
        "local": "Biblioteca",
        "status_request": "Em andamento",
        "date_request": "04/08/2024",
        "date_conclusion": "null",
        "email": "johndoe@example.com" 
      },
      ...
    ]
    ```

- **POST `/request`**
  - **Descrição**: Cria uma nova solicitação de manutenção com base nas informações fornecidas pelo usuário, incluindo uma imagem do monumento quebrado.
  - **Dados de Exemplo (Body)**: 
    ```json
    {
      "title": "Ventilador",
      "image": "http://example.com/imagem1.jpg",
      "description": "Grade pendurada",
      "local": "Biblioteca"
    }
    ```
  - **Exemplo de Resposta**: 
    ```json
    {
      "message": "Requisição criada com sucesso!",
      "id": 1
    }
    ```

- **PUT `/request/:id`**
  - **Descrição**: Atualiza o status de uma solicitação existente (por exemplo, de "Em andamento" para "Concluído").
  - **Parâmetro de URL**: `id` - O ID da solicitação a ser atualizada.
  - **Dados de Exemplo (Body)**:
    ```json
    {
      "status": "Concluído"
    }
    ```

- **DELETE `/request/:id`**
  - **Descrição**: Exclui uma solicitação específica baseada no seu ID.
  - **Parâmetro de URL**: `id` - O ID da solicitação.

#### Exemplo de Uso:

- Criar uma nova solicitação (POST):
 
  ```bash
  curl -X POST http://localhost:<PORT>/request \
    -H "Content-Type: application/json" \
    -d '{"title": "Ventilador", "image": "http://example.com/imagem1.jpg", "description": "Grade pendurada", "local": "Biblioteca"}'
  ```

- Atualizar o status de uma solicitação (PUT):
 
  ```bash
  curl -X PUT http://localhost:<PORT>/request/1 \
    -H "Content-Type: application/json" \
    -d '{"status": "Concluído"}'
  ```

- Excluir uma solicitação (DELETE):

  ```bash
  curl -X DELETE http://localhost:<PORT>/request/1
  ```

---

### 2. **Rotas de Usuário (`user.routes.js`)**

As rotas de usuário gerenciam o cadastro, autenticação e exclusão de usuários na plataforma, permitindo que cada usuário crie uma conta e gerencie apenas as suas solicitações.

#### Endpoints:

- **GET `/user`**
  - **Descrição**: Retorna todos os usuários cadastrados.
  - **Exemplo de Resposta**: 
    ```json
    [
      {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "password": "senhaSegura123",
        "isAdmin": "False",
        "isStudent": "True"
      },
      ...
    ]
    ```

- **POST `/user`** 
  - **Descrição**: Cria um novo usuário.
  - **Dados de Exemplo (Body)**: 
    ```json
    {
      "nome": "John Doe",
      "email": "johndoe@example.com",
      "password": "senhaSegura123",
      "isAdmin": "False",
      "isStudent": "True"
    }
    ```
  - **Exemplo de Resposta**:
    ```json
    {
      "message": "Usuário registrado!"
    }
    ```

- **PUT `/user/:email`**
  - **Descrição**: Atualiza as informações de um usuário baseado em seu email.
  - **Parâmetro de URL**: `email` - O email do usuário a ser atualizado.
  - **Dados de Exemplo (Body)**:
    ```json
    {
      "name": "Jane Doe"
    }
    ```

- **GET `/user/:email`**
  - **Descrição**: Retorna os detalhes de um usuário específico.
  - **Parâmetro de URL**: `email` - O email do usuário.

- **DELETE `/user/:email`**
  - **Descrição**: Exclui um usuário baseado em seu email.
  - **Parâmetro de URL**: `email` - O email do usuário.

#### Exemplo de Uso:

- Criar um novo usuário (POST):

  ```bash
  curl -X POST http://localhost:<PORT>/user \
    -H "Content-Type: application/json" \
    -d '{"nome": "John Doe", "email": "johndoe@example.com", "password": "senhaSegura123", "isAdmin": "False", "isStudent": "True"}'
  ```

- Atualizar um usuário existente (PUT):

  ```bash
  curl -X PUT http://localhost:<PORT>/user/johndoe@example.com \
    -H "Content-Type: application/json" \
    -d '{"nome": "Jane Doe"}'
  ```

- Obter detalhes de um usuário por email (GET):

  ```bash
  curl http://localhost:<PORT>/user/johndoe@example.com
  ```

- Excluir um usuário por email (DELETE):

  ```bash
  curl -X DELETE http://localhost:<PORT>/user/johndoe@example.com
  ```

---

### Observações

- Certifique-se de que o servidor Express está em execução para realizar as requisições.
- Substitua `<PORT>` pela porta onde o servidor está rodando.
- As rotas de `request` podem incluir a URL de uma imagem enviada pelo usuário para relatar o problema no monumento.
