const app = require("../src/app")
const supertest = require("supertest")
const request = supertest(app)
const { sequelize } = require("../src/config/db")


describe('Refresh', () => {
    beforeAll(async () => {
        await sequelize.sync({force: true})
    })

    let refreshToken

    it("deve criar um usuário", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })

        expect(response.status).toBe(201)
    })

     it("deve fazer login com sucesso e retornar tokens", async () => {
        const response = await request.post("/auth/login").send({
            email: "teste@email.com",
            password: "123456"
        })

        refreshToken = response.body.refreshToken

        expect(response.status).toBe(200)
    })

    it("Deve fazer o refresh token", async () => {
        const response = await request.post("/auth/refresh").send({
            refreshToken: refreshToken
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")
        expect(response.body).toHaveProperty("refreshToken")
    })

    it("Deve retornar erro de token inválido", async () => {
        const response = await request.post("/auth/refresh").send({
            refreshToken: "token_invalido"
        })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message")
    })
})