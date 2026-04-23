# E-commerce API

this is a backend API for e-commerce, with the goals learn and improve my code

## Features 

- Register a new user
- Login to receive a token
- View users with token

## Technologies 

- Node.js
- Express
- bcryptjs
- MySQL2
- Sequelize
- Jsonwebtoken
- Zod
- dotenv

## Endpoints 

- `GET /users` - list all registered users | token required
- `POST /users` - register a new account | public
- `POST /auth/login` - authenticate and return token | public

## Usage 

```bash
Request
POST /users
Body:
{
  "name": "Lucary",
  "email": "lucary@email.com",
  "password": "123456"
}
```
```bash
Response

{
  "id": 1,
  "name": "Lucary",
  "email": "lucary@email.com",
  "updatedAt": "2026-04-22T23:44:24.955Z",
  "createdAt": "2026-04-22T23:44:24.955Z"
}
```

## Running the application

- Configure your environment variables in .env

```bash 
git clone https://github.com/DevLucary/e-commerce-api
npm install 
node src/index.js
```

## Project status
 
- This project is in development

Checklist:
- [ ] CRUD de produtos e categorias
- [ ] Carrinho de compras
- [ ] Pedidos
- [ ] Upload de imagem
- [ ] Roles (admin/customer)
- [ ] Testes automatizados
- [ ] Deploy

## Author

Lucary Leão Ferreira  
GitHub: [DevLucary](https://github.com/DevLucary)