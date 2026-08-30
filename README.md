# E-COMMERCE API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Deploy](https://img.shields.io/badge/Deploy-Online-0B0D0E?logo=render&logoColor=white)

REST API that simulates an e-commerce backend with authentication, role-based authorization, products, categories, cart, order history and transactional checkout. The project includes overselling protection with database transactions and row locks, refresh token rotation, structured logging, automated tests and Swagger documentation.

## Features

### Authentication & Security
- JWT access tokens
- Refresh token rotation
- Refresh tokens stored as SHA-256 hashes
- Customer/admin roles and protected routes
- Password hashing with bcryptjs
- Rate limiting
- Security headers with Helmet
- CORS

### Products & Categories
- Category CRUD
- Product CRUD
- Product image upload
- Product pagination
- Sorting by price/date
- Filtering by category and price range
- Stock validation

### Cart & Orders
- Add, update and remove cart items
- Cart total calculation
- Transactional checkout
- Database locks to prevent overselling
- Product stock revalidation during checkout
- Order history

### Quality & DevOps
- 105 automated tests with Jest and Supertest
- Structured logs with Pino
- Docker and Docker Compose support
- Swagger documentation
- MySQL support with configurable port and TLS/SSL
- Production deployment on Render with Aiven MySQL

## Technologies

### Backend
- Node.js
- Express

### Database
- MySQL
- mysql2
- Sequelize

### Authentication & Security
- jsonwebtoken
- bcryptjs
- Helmet
- CORS
- express-rate-limit

### Validation & Logging
- Zod
- Pino

### Testing
- Jest
- Supertest
- SQLite in-memory database for automated tests

### DevOps & Documentation
- Docker
- Docker Compose
- Swagger
- Render
- Aiven MySQL

## Endpoints

### Users
- `GET /users` - list registered users | admin required
- `POST /users` - register a customer account | public

### Authentication
- `POST /auth/login` - authenticate and return access/refresh tokens | public
- `POST /auth/refresh` - rotate the refresh token and return new tokens | public

### Admin
- `POST /admin` - create a new admin account | admin required

### Categories
- `GET /categories` - list categories | public
- `GET /categories/:id` - get category by id | public
- `POST /categories` - create category | admin required
- `PUT /categories/:id` - update category | admin required
- `DELETE /categories/:id` - delete category | admin required

### Products
- `GET /products` - list products | public
- `GET /products/:id` - get product by id | public
- `POST /products` - create product | admin required
- `PUT /products/:id` - update product | admin required
- `DELETE /products/:id` - delete product | admin required
- `PATCH /products/:id/upload` - upload/update product image | admin required

### Cart
- `GET /cart/items` - get authenticated user's cart items | token required
- `GET /cart/items/calculate` - calculate cart total | token required
- `POST /cart/items` - add item to cart | token required
- `PUT /cart/items/:productId` - update item quantity | token required
- `DELETE /cart/items/:productId` - remove item from cart | token required

### Orders
- `POST /order` - checkout | token required
- `GET /order` - get authenticated user's order history | token required

## Usage

### Create user

Request:

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "123456"
}
```

Example response:

```json
{
  "role": "customer",
  "id": 1,
  "name": "Example User",
  "email": "user@example.com",
  "updatedAt": "...",
  "createdAt": "..."
}
```

### Login

Request:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Example response:

```json
{
  "token": "JWT_ACCESS_TOKEN",
  "user": {
    "id": 1,
    "name": "Example User",
    "email": "user@example.com",
    "role": "customer"
  },
  "refreshToken": "REFRESH_TOKEN"
}
```

### Refresh access token

Request:

```http
POST /auth/refresh
Content-Type: application/json
```

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

The endpoint invalidates the previous refresh token and returns a new access token and refresh token.

## Environment variables

Copy `.env.example` to `.env` and configure the environment before running the application.

```env
PORT=8089

DB_NAME=DATABASE_NAME
DB_USER=MYSQL_USER
DB_PASS=MYSQL_PASSWORD
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false
DB_CA_PATH=./certs/ca.pem

JWT_SECRET=CHANGE_THIS_SECRET

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD
```

`DB_ROOT_PASS` is also used by the local Docker Compose MySQL service. Do not commit real credentials or secrets.

For remote MySQL providers that require TLS, configure `DB_SSL=true`, the provider port in `DB_PORT`, and a trusted CA certificate through `DB_CA_PATH`.

## Running locally

```bash
git clone https://github.com/DevLucary/e-commerce-api
cd e-commerce-api
npm install
npm start
```

## Run with Docker

Configure `.env`, then run:

```bash
docker compose up --build
```

## Admin seed

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then run:

```bash
node seed.js
```

The seed creates the configured admin account when it does not already exist.

## Testing

The project includes integration tests using Jest and Supertest with an in-memory SQLite database.

Run all tests with:

```bash
npm test
```

Current suite: **105 automated tests**.

> The automated suite uses SQLite, so MySQL-specific transaction and locking behavior should also be validated against MySQL when changing checkout concurrency logic.

## Deploy

Production API:

- https://e-commerce-api-ukuj.onrender.com

Swagger documentation:

- Local: http://localhost:8089/api-docs
- Production: https://e-commerce-api-ukuj.onrender.com/api-docs

The production API runs on Render and connects to Aiven MySQL over TLS.

## Roadmap

- [x] User roles (admin/customer)
- [x] Refresh token rotation
- [x] Order history endpoint
- [ ] CI/CD pipeline
- [ ] Database migrations

## Author

Lucary Leão Ferreira  
GitHub: [DevLucary](https://github.com/DevLucary)
