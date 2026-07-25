const app = require("../src/app");
const request = require("supertest")(app);
const { sequelize } = require("../src/config/db");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

describe("Admin Routes", () => {
  let adminToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@email.com",
      password: hashedPassword,
      role: "admin",
    });

    const loginResponse = await request.post("/auth/login").send({
      email: "admin@email.com",
      password: "123456",
    });

    adminToken = loginResponse.body.token;
  });

  it("Deve criar um novo usuário admin com sucesso", async () => {
    const response = await request
      .post("/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Novo Admin",
        email: "novoadmin@email.com",
        password: "123456",
        role: "admin",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Novo Admin");
    expect(response.body).toHaveProperty("email", "novoadmin@email.com");
    expect(response.body).toHaveProperty("role", "admin");
  });

  it("Deve criar um novo usuário cliente pelo admin", async () => {
    const response = await request
      .post("/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Novo Cliente",
        email: "clienteadmin@email.com",
        password: "123456",
        role: "customer",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("role", "customer");
  });

  it("Deve retornar 403 quando um cliente tenta criar admin", async () => {
    const userResponse = await request.post("/users").send({
      name: "Cliente",
      email: "cliente@email.com",
      password: "123456",
    });

    const loginResponse = await request.post("/auth/login").send({
      email: "cliente@email.com",
      password: "123456",
    });

    const customerToken = loginResponse.body.token;

    const response = await request
      .post("/admin")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        name: "Tentativa",
        email: "tentativa@email.com",
        password: "123456",
        role: "admin",
      });

    expect(response.status).toBe(403);
  });

  it("Deve retornar 401 quando não há token", async () => {
    const response = await request.post("/admin").send({
      name: "Sem Token",
      email: "semtoken@email.com",
      password: "123456",
      role: "admin",
    });

    expect(response.status).toBe(401);
  });
});
