# E-COMMERCE API

this is a backend API for e-commerce, with the goals learn and improve my code

## Features 

- Register a new user
- Login to receive a token
- View users with token
- User with a shopping cart 

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

- `GET /users` - get all registered users | token required
- `POST /users` - register a new account | public
- `POST /auth/login` - authenticate and return token | public

### Categories
- `GET /categories` - get all categories | public
- `GET /categories/:id` - get category by id | public
- `POST /categories` - create new category | token required
- `PUT /categories/:id` - update existing category | token required
- `DELETE /categories/:id` - delete existing category | token required

### Products
- `GET /products` - get all products | public
- `GET /products/:id` - get product by id | public
- `POST /products` - create new product | token required
- `PUT /products/:id` - update existing product | token required
- `DELETE /products/:id` - delete existing product | token required

### Cart / Cart Items
- `GET /cart/items` - get all cart items | token required
- `GET /cart/items/calculate` - sum of the prices of all products | token required
- `POST /cart/items` - create new cart item | token required
- `PUT /cart/items/:productId` - update the product quantity | token required
- `DELETE /cart/items/:productId` - remove item from cart | token required

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
- [x] CRUD de produtos e categorias
- [x] Carrinho de compras
- [ ] Pedidos
- [ ] Upload de imagem
- [ ] Roles (admin/customer)
- [ ] Testes automatizados
- [ ] Deploy

## Author

Lucary Leão Ferreira  
GitHub: [DevLucary](https://github.com/DevLucary)