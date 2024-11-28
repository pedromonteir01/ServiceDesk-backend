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

- [x] [AWS Client](https://www.npmjs.com/package/@aws-sdk/client-s3)
- Para realizar requisições a AWS

- [x] [AWS Presigner](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner/v/1.0.0-rc.3)
- Gera URL válida para a AWS

- [x] [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Gera um código seguro e único para validações

- [x] [CORS](https://www.npmjs.com/package/cors)
- Habilita o middleware cors para o Express

- [X] [Multer](https://www.npmjs.com/package/multer)
- Realiza envio de arquivos em NODE

- [X] [Nodemailer](https://www.npmjs.com/package/nodemailer)
- Permite envio de e-mail para os usuários sem um servidor SMTP, utilizando o NODE

- [X] [uuid](https://www.npmjs.com/package/uuid]
- Gera um código identificador único 


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
    quantity: 2,
    requests: [
      {
        "id": 1,
        "title": "Ventilador",
        "image": "http://example.com/imagem1.jpg",
        "description": "Grade pendurada",
        "local": "Biblioteca",
        "status_request": "Em andamento",
        "date_request": "2024-11-28",
        "date_conclusion": "2024-11-28",
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
  title: 'TESTE',
  description: 'Ventilador quebrado',
  local: 'Banheiros e Limpeza',
  image: [137,  80,  78, ..., 11] //buffer,
  imageName: "bathroom.png",
  imageType: 'image/png',
  status_request: 'inconclued',
  date_request: '2024-11-28T22:46:48.680Z',
  date_conclusion: null,
  priority: 'medium',
  email: 'pedrohenriquesilva@aluno.senai.br'
}
```
  - **Exemplo de Resposta**:
```json
{
  id: 1,
  title: 'TESTE',
  image: 'link AWS',
  priority: 'média',
  description: 'Ventilador quebrado',
  local: 'Banheiros e Limpeza',
  status_request: 'aguardando',
  date_request: '2024-11-28T03:00:00.000Z',
  date_conclusion: null,
  email: 'pedrohenriquesilva@aluno.senai.br'
}
```

- **PUT `/request/:id`**
  - **Descrição**: Atualiza o status de uma solicitação existente (por exemplo, de "Em andamento" para "Concluído").
  - **Parâmetro de URL**: `id` - O ID da solicitação a ser atualizada.
  - **Dados de Exemplo (parameter)**:
    ```json
    {
      "status": "Concluído"
    }
    ```

- **DELETE `/request/:id`**
  - **Descrição**: Exclui uma solicitação específica baseada no seu ID.
  - **Parâmetro de URL**: `id` - O ID da solicitação.

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
        "isAdmin": "admin",
        "isStudent": "student"
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
      "isAdmin": "admin",
      "isStudent": "student"
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

---
### Observações

- Certifique-se de que o servidor Express está em execução para realizar as requisições.
- Substitua `<PORT>` pela porta onde o servidor está rodando.
- As rotas de `request` podem incluir a URL de uma imagem enviada pelo usuário para relatar o problema no monumento.
