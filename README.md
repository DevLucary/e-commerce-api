# E-COMMERCE API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Deploy](https://img.shields.io/badge/Deploy-Online-0B0D0E?logo=railway&logoColor=white)

This API simulates an e-commerce system. It includes JWT authentication, a checkout with overselling protection using transactions and locks, structured logs with Pino, 91 automated tests with Jest and Supertest, and Swagger documentation available on the Railway deploy.

## Features 

**Authentication & Security**
- JWT login and route protection
- Rate limiting and security headers (Helmet)

**Products & Categories**
- Full CRUD with image upload
- Pagination, sorting by price/date, and filtering by category/price range

**Cart & Checkout**
- Add, update, and remove items
- Transactional checkout with database locks to prevent overselling

**Quality & DevOps**
- 91 automated tests (Jest + Supertest)
- Structured logs with Pino
- Docker support
- Swagger documentation

## Technologies

**Backend**
- Node.js
- Express

**Database**
- MySQL2
- Sequelize

**Authentication & Security**
- Jsonwebtoken
- bcryptjs
- Helmet
- CORS
- express-rate-limit

**Validation & Logging**
- Zod
- Pino

**Testing**
- Jest
- Supertest

**DevOps & Documentation**
- Docker
- Swagger

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
- `PATCH /products/:id/upload` - update image of product | token required

### Cart / Cart Items
- `GET /cart/items` - get all cart items | token required
- `GET /cart/items/calculate` - sum of the prices of all products | token required
- `POST /cart/items` - create new cart item | token required
- `PUT /cart/items/:productId` - update the product quantity | token required
- `DELETE /cart/items/:productId` - remove item from cart | token required

### Order / Order Items
- `POST /order` - create order of products | token required

## Usage 

Create user
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

User Login
```bash
Request
POST /auth/login
Body: 
{
  "email": "lucary@email.com",
  "password": "123456"
}
```
```bash
Response
{
  "token": "string (JWT)",
  "user": 
  {
    "id": 1,
    "name": "Lucary",
    "email": "lucary@email.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Running the application

- Copy `.env.example` to `.env` and fill in the required environment variables.

```bash
git clone https://github.com/DevLucary/e-commerce-api
npm install
node src/index.js
```

## Roadmap

- [ ] User roles (admin/customer)
- [ ] Refresh token rotation
- [ ] CI/CD pipeline
- [ ] Order history endpoint

## Deploy

The API is documented with Swagger. After starting the server, access:

- Local: http://localhost:8089/api-docs
- Production: https://e-commerce-api-production-1902.up.railway.app/api-docs

## Run with docker 

```bash
docker compose up --build
```

## Testing

The project includes integration tests using Jest and Supertest with an in-memory SQLite database.

Run all test with:
```bash
npm test
```

## Author

Lucary Leão Ferreira  
GitHub: [DevLucary](https://github.com/DevLucary)