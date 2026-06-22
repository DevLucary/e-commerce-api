const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")

describe("Users", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })
    
    let token

    it("Deve criar um novo usuário", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name", "teste")
        expect(response.body).toHaveProperty("email", "teste@email.com")
    })

    it("Deve retornar erro de validação", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com"
        })

        expect(response.status).toBe(400)
    })

    it("deve retornar erro de nome inválido", async () => {
        const response = await request.post("/users").send({
            name: "t",
            email: "teste@email.com",
            password: "1234567"
        })

        expect(response.status).toBe(400)
    })

    it("deve retornar erro de email inválido", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste",
            password: "1234567"
        })

        expect(response.status).toBe(400)
    })

    it("deve retornar erro de senha inválida", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "12345"
        })

        expect(response.status).toBe(400)
    })

    it("Deve fazer login", async () => {
        const response = await request.post("/auth/login").send({
            email: "teste@email.com",
            password: "123456"
        })

        token = response.body.token

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")
    })

    it("Deve listar todos os usuários", async () => {
        const response = await request.get("/users").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty("id")
        expect(response.body[0]).toHaveProperty("name", "teste")
        expect(response.body[0]).toHaveProperty("email", "teste@email.com")
    })

    it("Deve retornar erro de autenticação quando não fornecer token", async () => {
        const response = await request.get("/users")

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de email já cadastrado", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })

        expect(response.status).toBe(409)
    })
})