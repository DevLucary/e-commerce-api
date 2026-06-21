const app = require("../src/app")
const supertest = require("supertest")
const request = supertest(app)
const { sequelize } = require("../src/config/db")

describe("Auth", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    it("deve criar um usuário", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("name", "teste")
        expect(response.body).toHaveProperty("email", "teste@email.com")
    })

    it("deve dar erro de formatação", async () => {
        const response = await request.post("/auth/login").send({
            email: "",
            password: ""
        })

        expect(response.status).toBe(400)
    })

    it("deve dar erro de usuário inválido", async () => {
        const response = await request.post("/auth/login").send({
            email: "invalid@email.com",
            password: "123456"
        })

        expect(response.status).toBe(401)
    })

    it("deve dar erro de senha inválida", async () => {
        const response = await request.post("/auth/login").send({
            email: "teste@email.com",
            password: "654321"
        })

        expect(response.status).toBe(401)
    })
})