# Game Vault Backend

Backend da aplicação **Game Vault**, desenvolvido com Node.js, Express, MongoDB/Mongoose e GraphQL.

A aplicação disponibiliza uma API REST e uma API GraphQL para autenticação de usuários, consulta de jogos, gerenciamento de biblioteca, avaliações e Top 5 de jogos.

Os jogos são obtidos através da API da [RAWG](https://rawg.io/apidocs).

---

## Índice

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Executando o projeto](#executando-o-projeto)
- [Autenticação](#autenticação)
- [API REST](#api-rest)
  - [POST /register](#post-register)
  - [POST /login](#post-login)
  - [GET /profile](#get-profile)
  - [GET /games](#get-games)
  - [GET /games/:id](#get-gamesid)
  - [GET /library](#get-library)
  - [POST /library](#post-library)
  - [PUT /library/:gameId](#put-librarygameid)
  - [DELETE /library/:gameId](#delete-librarygameid)
  - [GET /rating](#get-rating)
  - [GET /rating/:gameId](#get-ratinggameid)
  - [POST /rating](#post-rating)
  - [PUT /rating/:id](#put-ratingid)
  - [DELETE /rating/:id](#delete-ratingid)
  - [GET /top5](#get-top5)
  - [POST /top5](#post-top5)
  - [PUT /top5/:position](#put-top5position)
  - [DELETE /top5/:position](#delete-top5position)
- [API GraphQL](#api-graphql)
  - [Endpoint](#endpoint)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Modelos](#modelos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Regras importantes](#regras-importantes)
- [Status HTTP](#status-http)
- [Licença](#licença)

---

## Tecnologias

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- CORS
- GraphQL
- graphql-http
- RAWG API
- dotenv

---

## Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Autenticação através de cookie HTTP-only
- Consulta de jogos através da RAWG API
- Consulta de jogo por ID
- Consulta de perfil do usuário
- Gerenciamento da biblioteca pessoal
- Alteração do status de jogos na biblioteca
- Criação de avaliações
- Atualização de avaliações
- Exclusão de avaliações
- Consulta das avaliações do usuário
- Consulta das avaliações de um jogo
- Criação do Top 5
- Alteração de posição do Top 5
- Exclusão de jogos do Top 5
- API REST
- API GraphQL

---

## Estrutura do projeto

```text
game-vault-backend/
├── src/
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── game.js
│   │   ├── library.js
│   │   ├── profile.js
│   │   ├── rating.js
│   │   └── top5.js
│   │
│   ├── graphql/
│   │   ├── context.js
│   │   ├── resolvers.js
│   │   └── schema.js
│   │
│   ├── lib/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── library.js
│   │   ├── rating.js
│   │   ├── top5.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── game.js
│   │   ├── library.js
│   │   ├── profile.js
│   │   ├── rating.js
│   │   └── top5.js
│   │
│   ├── services/
│   │   ├── game.js
│   │   ├── library.js
│   │   ├── profile.js
│   │   ├── rating.js
│   │   └── top5.js
│   │
│   └── server.js
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

# Requisitos

Antes de executar o projeto, tenha instalado:

- Node.js
- npm
- MongoDB ou uma URI de MongoDB Atlas
- Chave da API RAWG

---

# Configuração

Clone o projeto e entre na pasta:

```bash
git clone https://github.com/ByteFive/game-vault-backend.git
cd game-vault-backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz:

```env
PORT=8080
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta
RAWG_API_KEY=sua_chave_da_rawg
NODE_ENV=development
```

O arquivo `.env` não deve ser versionado.

---

# Executando o projeto

Modo desenvolvimento:

```bash
npm run dev
```

O servidor ficará disponível por padrão em:

```text
http://127.0.0.1:8080
```

API REST:

```text
http://127.0.0.1:8080
```

API GraphQL:

```text
http://127.0.0.1:8080/graphql
```

---

# Autenticação

A autenticação utiliza JWT armazenado em um cookie HTTP-only chamado:

```text
token
```

O fluxo é:

```text
POST /register
      ↓
POST /login
      ↓
Cookie token
      ↓
Rotas protegidas
```

O login gera um JWT com validade de 1 dia.

O cookie possui:

- `httpOnly: true`
- `secure: true` em produção
- `sameSite: strict`
- validade de 24 horas

As rotas protegidas utilizam esse cookie para identificar o usuário.

No Postman, depois de executar o login, mantenha o cookie `token` para as requisições seguintes.

---

# API REST

## POST /register

Cadastra um novo usuário.

### Requisição

```http
POST http://127.0.0.1:8080/register
Content-Type: application/json
```

```json
{
  "name": "Alison",
  "email": "alison@email.com",
  "password": "123456"
}
```

### Resposta

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "_id": "ID_DO_USUARIO",
    "name": "Alison",
    "email": "alison@email.com",
    "avatar": null
  }
}
```

### Erros

Usuário já cadastrado:

```json
{
  "message": "Email já cadastrado"
}
```

---

## POST /login

Realiza o login e cria o cookie JWT.

### Requisição

```http
POST http://127.0.0.1:8080/login
Content-Type: application/json
```

```json
{
  "email": "alison@email.com",
  "password": "123456"
}
```

### Resposta

```json
{
  "message": "Login successful"
}
```

O servidor também envia:

```text
Set-Cookie: token=JWT...
```

---

## GET /profile

Retorna o perfil do usuário autenticado.

### Requisição

```http
GET http://127.0.0.1:8080/profile
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "name": "Alison",
  "email": "alison@email.com",
  "avatar": null,
  "reviewsQuantity": 3
}
```

---

## GET /games

Retorna os jogos disponíveis através da RAWG API.

### Requisição

```http
GET http://127.0.0.1:8080/games
Cookie: token=SEU_TOKEN
```

### Resposta

```json
[
  {
    "id": 3498,
    "name": "Grand Theft Auto V",
    "description": "Descrição do jogo",
    "released": "2013-09-17",
    "rating": 4.47,
    "metacritic": 92,
    "cover": "https://...",
    "genres": [
      "Action",
      "Adventure"
    ],
    "platforms": [
      "PC",
      "PlayStation 4",
      "Xbox One"
    ],
    "developers": [
      "Rockstar North"
    ]
  }
]
```

---

## GET /games/:id

Retorna um jogo específico.

### Requisição

```http
GET http://127.0.0.1:8080/games/3498
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "id": 3498,
  "name": "Grand Theft Auto V",
  "description": "Descrição do jogo",
  "released": "2013-09-17",
  "rating": 4.47,
  "metacritic": 92,
  "cover": "https://...",
  "genres": [
    "Action",
    "Adventure"
  ],
  "platforms": [
    "PC",
    "PlayStation 4",
    "Xbox One"
  ],
  "developers": [
    "Rockstar North"
  ]
}
```

---

# Biblioteca

## GET /library

Retorna a biblioteca do usuário autenticado.

### Requisição

```http
GET http://127.0.0.1:8080/library
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "_id": "ID_DA_BIBLIOTECA",
  "userId": "ID_DO_USUARIO",
  "games": [
    {
      "gameId": 3498,
      "status": "want_to_play"
    }
  ],
  "createdAt": "2026-09-04T00:00:00.000Z",
  "updatedAt": "2026-09-04T00:00:00.000Z"
}
```

---

## POST /library

Adiciona um jogo à biblioteca.

### Requisição

```http
POST http://127.0.0.1:8080/library
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "id": 3498
}
```

### Resposta

```json
{
  "_id": "ID_DA_BIBLIOTECA",
  "userId": "ID_DO_USUARIO",
  "games": [
    {
      "gameId": 3498,
      "status": "want_to_play"
    }
  ]
}
```

O jogo é adicionado inicialmente com:

```text
want_to_play
```

---

## PUT /library/:gameId

Atualiza o status de um jogo da biblioteca.

### Requisição

```http
PUT http://127.0.0.1:8080/library/3498
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "status": "playing"
}
```

### Resposta

```json
{
  "message": "Atualizado com sucesso",
  "game": {
    "gameId": 3498,
    "status": "playing"
  }
}
```

### Status disponíveis

```text
want_to_play
playing
completed
abandoned
```

---

## DELETE /library/:gameId

Remove um jogo da biblioteca.

### Requisição

```http
DELETE http://127.0.0.1:8080/library/3498
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "message": "Jogo removido da biblioteca",
  "library": {
    "_id": "ID_DA_BIBLIOTECA",
    "userId": "ID_DO_USUARIO",
    "games": []
  }
}
```

---

# Avaliações

## GET /rating

Retorna todas as avaliações feitas pelo usuário autenticado.

### Requisição

```http
GET http://127.0.0.1:8080/rating
Cookie: token=SEU_TOKEN
```

### Resposta

```json
[
  {
    "_id": "ID_DA_AVALIACAO",
    "userId": "ID_DO_USUARIO",
    "gameId": 3498,
    "rating": 5,
    "comment": "Excelente jogo!",
    "createdAt": "2026-09-04T00:00:00.000Z",
    "updatedAt": "2026-09-04T00:00:00.000Z"
  }
]
```

---

## GET /rating/:gameId

Retorna as avaliações de um jogo.

### Requisição

```http
GET http://127.0.0.1:8080/rating/3498
Cookie: token=SEU_TOKEN
```

### Resposta

```json
[
  {
    "_id": "ID_DA_AVALIACAO",
    "userId": "ID_DO_USUARIO",
    "gameId": 3498,
    "rating": 5,
    "comment": "Excelente jogo!"
  }
]
```

---

## POST /rating

Cria uma avaliação.

### Requisição

```http
POST http://127.0.0.1:8080/rating
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "gameId": 3498,
  "rating": 5,
  "comment": "Excelente jogo!"
}
```

### Resposta

```json
{
  "_id": "ID_DA_AVALIACAO",
  "userId": "ID_DO_USUARIO",
  "gameId": 3498,
  "rating": 5,
  "comment": "Excelente jogo!",
  "createdAt": "2026-09-04T00:00:00.000Z",
  "updatedAt": "2026-09-04T00:00:00.000Z"
}
```

### Regras

A nota deve estar entre:

```text
1
2
3
4
5
```

Cada usuário pode possuir uma avaliação por jogo.

---

## PUT /rating/:id

Atualiza uma avaliação.

### Requisição

```http
PUT http://127.0.0.1:8080/rating/ID_DA_AVALIACAO
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "rating": 4,
  "comment": "Depois de jogar mais, achei um pouco abaixo."
}
```

### Resposta

```json
{
  "_id": "ID_DA_AVALIACAO",
  "userId": "ID_DO_USUARIO",
  "gameId": 3498,
  "rating": 4,
  "comment": "Depois de jogar mais, achei um pouco abaixo."
}
```

---

## DELETE /rating/:id

Remove uma avaliação.

### Requisição

```http
DELETE http://127.0.0.1:8080/rating/ID_DA_AVALIACAO
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "message": "Avaliação deletada com sucesso",
  "review": {
    "acknowledged": true,
    "deletedCount": 1
  }
}
```

---

# Top 5

## GET /top5

Retorna o Top 5 do usuário autenticado.

### Requisição

```http
GET http://127.0.0.1:8080/top5
Cookie: token=SEU_TOKEN
```

### Resposta

```json
[
  {
    "_id": "ID",
    "userId": "ID_DO_USUARIO",
    "gameId": 3498,
    "position": 1,
    "createdAt": "2026-09-04T00:00:00.000Z",
    "updatedAt": "2026-09-04T00:00:00.000Z"
  }
]
```

---

## POST /top5

Adiciona um jogo ao Top 5.

### Requisição

```http
POST http://127.0.0.1:8080/top5
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "gameId": 3498,
  "position": 1
}
```

### Resposta

```json
{
  "_id": "ID",
  "userId": "ID_DO_USUARIO",
  "gameId": 3498,
  "position": 1,
  "createdAt": "2026-09-04T00:00:00.000Z",
  "updatedAt": "2026-09-04T00:00:00.000Z"
}
```

### Posições disponíveis

```text
1
2
3
4
5
```

---

## PUT /top5/:position

Altera a posição de um jogo no Top 5.

### Requisição

Por exemplo, mover o jogo da posição 1 para a posição 3:

```http
PUT http://127.0.0.1:8080/top5/1
Content-Type: application/json
Cookie: token=SEU_TOKEN
```

```json
{
  "position": 3
}
```

### Resposta

```json
{
  "message": "Posição alterada com sucesso",
  "top5": [
    {
      "_id": "ID",
      "userId": "ID_DO_USUARIO",
      "gameId": 3498,
      "position": 3
    }
  ]
}
```

Quando a posição de destino já possui um jogo, a implementação realiza a troca dos jogos entre as duas posições.

---

## DELETE /top5/:position

Remove o jogo de uma posição do Top 5.

### Requisição

```http
DELETE http://127.0.0.1:8080/top5/3
Cookie: token=SEU_TOKEN
```

### Resposta

```json
{
  "message": "Jogo removido do Top 5 com sucesso"
}
```

---

# API GraphQL

A API GraphQL utiliza um único endpoint:

```text
POST http://127.0.0.1:8080/graphql
```

Todas as operações GraphQL são enviadas nesse endpoint.

As operações protegidas também utilizam o cookie JWT criado no login.

---

# Queries

## Buscar jogos

```graphql
query {
  games {
    id
    name
    description
    released
    rating
    metacritic
    cover
    genres
    platforms
    developers
  }
}
```

---

## Buscar jogo por ID

```graphql
query {
  game(id: 3498) {
    id
    name
    description
    released
    rating
    metacritic
    cover
    genres
    platforms
    developers
  }
}
```

---

## Buscar usuário autenticado

```graphql
query {
  me {
    id
    name
    email
    avatar
    createdAt
    updatedAt
  }
}
```

---

## Buscar perfil

```graphql
query {
  profile {
    name
    email
    avatar
    reviewsQuantity
  }
}
```

---

## Buscar biblioteca

```graphql
query {
  library {
    id
    userId
    games {
      gameId
      status
      game {
        id
        name
        cover
        rating
      }
    }
    createdAt
    updatedAt
  }
}
```

---

## Buscar avaliações do usuário

```graphql
query {
  ratings {
    id
    userId
    gameId
    rating
    comment
    game {
      id
      name
      cover
    }
    createdAt
    updatedAt
  }
}
```

---

## Buscar avaliações de um jogo

```graphql
query {
  ratingsByGame(gameId: 3498) {
    id
    userId
    gameId
    rating
    comment
    game {
      id
      name
      cover
    }
    createdAt
    updatedAt
  }
}
```

---

## Buscar Top 5

```graphql
query {
  top5 {
    id
    userId
    gameId
    position
    game {
      id
      name
      cover
      rating
    }
    createdAt
    updatedAt
  }
}
```

---

# Mutations

## Registrar usuário

```graphql
mutation {
  register(
    name: "Alison"
    email: "alison@email.com"
    password: "123456"
  ) {
    message
    user {
      id
      name
      email
      avatar
      createdAt
      updatedAt
    }
  }
}
```

---

## Login

```graphql
mutation {
  login(
    email: "alison@email.com"
    password: "123456"
  ) {
    message
  }
}
```

O login cria o cookie JWT automaticamente.

---

## Adicionar jogo à biblioteca

```graphql
mutation {
  addGameToLibrary(gameId: 3498) {
    id
    userId
    games {
      gameId
      status
      game {
        id
        name
        cover
      }
    }
  }
}
```

---

## Atualizar status da biblioteca

```graphql
mutation {
  updateLibraryGame(
    gameId: 3498
    status: playing
  ) {
    message
    game {
      gameId
      status
      game {
        id
        name
        cover
      }
    }
  }
}
```

Status disponíveis:

```text
want_to_play
playing
completed
abandoned
```

---

## Remover jogo da biblioteca

```graphql
mutation {
  removeGameFromLibrary(gameId: 3498) {
    message
    library {
      id
      userId
      games {
        gameId
        status
      }
    }
  }
}
```

---

## Criar avaliação

```graphql
mutation {
  createRating(
    gameId: 3498
    rating: 5
    comment: "Excelente jogo!"
  ) {
    id
    userId
    gameId
    rating
    comment
    game {
      id
      name
      cover
    }
    createdAt
    updatedAt
  }
}
```

---

## Atualizar avaliação

```graphql
mutation {
  updateRating(
    id: "ID_DA_AVALIACAO"
    rating: 4
    comment: "Depois de jogar mais, achei um pouco abaixo."
  ) {
    id
    userId
    gameId
    rating
    comment
    game {
      id
      name
    }
    updatedAt
  }
}
```

---

## Remover avaliação

```graphql
mutation {
  deleteRating(id: "ID_DA_AVALIACAO") {
    message
  }
}
```

---

## Criar item no Top 5

```graphql
mutation {
  createTop5(
    gameId: 3498
    position: 1
  ) {
    id
    userId
    gameId
    position
    game {
      id
      name
      cover
    }
  }
}
```

---

## Alterar posição do Top 5

Exemplo: mover o jogo da posição 1 para a posição 3.

```graphql
mutation {
  updateTop5(
    position: 1
    newPosition: 3
  ) {
    message
    top5 {
      id
      userId
      gameId
      position
      game {
        id
        name
        cover
      }
    }
  }
}
```

Se a posição de destino estiver ocupada, os jogos das duas posições são trocados.

---

## Remover item do Top 5

```graphql
mutation {
  removeTop5(position: 3) {
    message
  }
}
```

---

# Resumo GraphQL

| Tipo | Operação | Autenticação |
|---|---|---|
| Query | `games` | Não |
| Query | `game` | Não |
| Query | `me` | Sim |
| Query | `profile` | Sim |
| Query | `library` | Sim |
| Query | `ratings` | Sim |
| Query | `ratingsByGame` | Sim |
| Query | `top5` | Sim |
| Mutation | `register` | Não |
| Mutation | `login` | Não |
| Mutation | `addGameToLibrary` | Sim |
| Mutation | `updateLibraryGame` | Sim |
| Mutation | `removeGameFromLibrary` | Sim |
| Mutation | `createRating` | Sim |
| Mutation | `updateRating` | Sim |
| Mutation | `deleteRating` | Sim |
| Mutation | `createTop5` | Sim |
| Mutation | `updateTop5` | Sim |
| Mutation | `removeTop5` | Sim |

---

# Modelos

## User

Campos:

```text
_id
name
email
password
avatar
createdAt
updatedAt
```

O email é único e armazenado em lowercase.

A senha é armazenada utilizando hash com bcrypt.

---

## Library

Campos:

```text
_id
userId
games[]
createdAt
updatedAt
```

Cada jogo da biblioteca possui:

```text
gameId
status
```

Um usuário possui uma única biblioteca.

---

## Rating

Campos:

```text
_id
userId
gameId
rating
comment
createdAt
updatedAt
```

A combinação:

```text
userId + gameId
```

é única.

A avaliação aceita valores de 1 a 5.

---

## Top5

Campos:

```text
_id
userId
gameId
position
createdAt
updatedAt
```

A combinação:

```text
userId + position
```

é única.

A combinação:

```text
userId + gameId
```

também é única.

As posições válidas são de 1 a 5.

---

# Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta do servidor | `8080` |
| `MONGODB_URI` | URI de conexão com MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Chave usada para assinar JWTs | `minha-chave-secreta` |
| `RAWG_API_KEY` | Chave da RAWG API | `xxxxxxxx` |
| `NODE_ENV` | Ambiente da aplicação | `development` |

Exemplo:

```env
PORT=8080
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gamevault
JWT_SECRET=uma-chave-secreta-forte
RAWG_API_KEY=sua-chave-rawg
NODE_ENV=development
```

---

# Regras importantes

### Autenticação

Todas as operações de perfil, biblioteca, avaliações e Top 5 exigem autenticação.

A autenticação é feita através do cookie:

```text
token
```

---

### Biblioteca

Ao adicionar um jogo novo, o status inicial é:

```text
want_to_play
```

Os status disponíveis são:

```text
want_to_play
playing
completed
abandoned
```

---

### Avaliações

Cada usuário pode avaliar um jogo apenas uma vez.

A nota deve estar entre:

```text
1 e 5
```

---

### Top 5

Cada usuário possui no máximo cinco posições:

```text
1
2
3
4
5
```

Um jogo não pode ocupar duas posições diferentes do mesmo Top 5.

Quando uma posição de destino já está ocupada, a operação de atualização troca os jogos entre as posições.

---

# Status HTTP

## Sucesso

```text
200 OK
201 Created
```

## Erros de cliente

```text
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

## Erro interno

```text
500 Internal Server Error
```

---

# Testando com Postman

Uma sequência recomendada para testar a API:

```text
1. POST /register
2. POST /login
3. GET /profile
4. GET /games
5. GET /games/:id
6. POST /library
7. GET /library
8. PUT /library/:gameId
9. POST /rating
10. GET /rating
11. GET /rating/:gameId
12. PUT /rating/:id
13. DELETE /rating/:id
14. POST /top5
15. GET /top5
16. PUT /top5/:position
17. DELETE /top5/:position
18. DELETE /library/:gameId
```

Para GraphQL:

```text
1. register
2. login
3. me
4. profile
5. games
6. game
7. addGameToLibrary
8. library
9. updateLibraryGame
10. createRating
11. ratings
12. ratingsByGame
13. updateRating
14. deleteRating
15. createTop5
16. top5
17. updateTop5
18. removeTop5
19. removeGameFromLibrary
```

---

# Arquitetura

O projeto utiliza uma separação entre:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

Para GraphQL:

```text
GraphQL Request
      ↓
Schema
      ↓
Resolvers
      ↓
Services / Models
      ↓
MongoDB / RAWG
```

A autenticação REST utiliza middleware JWT.

A autenticação GraphQL utiliza um contexto que lê o mesmo cookie JWT.

---

# Dependências principais

```json
{
  "bcrypt": "^6.0.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "graphql": "^17.0.2",
  "graphql-http": "^1.23.0",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.9.3"
}
```

---

# Scripts

Executar o servidor em desenvolvimento:

```bash
npm run dev
```

O projeto utiliza:

```text
node --watch src/server.js
```

---

# Licença

Este projeto está atualmente configurado com licença `ISC` no `package.json`.
