const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")

describe("Categories", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    let token

    it("Deve criar um usuário para testes", async () => {
        const response = await request.post("/users").send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })

        expect(response.status).toBe(201)
    })

    it("Deve fazer login com o usuário criado", async () => {
        const response = await request.post("/auth/login").send({
            email: "teste@email.com",
            password: "123456"
        })

        token = response.body.token

        expect(response.status).toBe(200)
    })

    it("Deve listar todas as categorias", async () => {
        const response = await request.get("/categories")

        expect(response.status).toBe(200)
    })
    
    it("Deve criar uma nova categoria", async () => {
        const response = await request.post("/categories/").set("Authorization", `Bearer ${token}`).send({
            name: "Teste"
        })
        
        expect(response.status).toBe(201)
    })
    
    it("Deve listar uma categoria específica", async () => {
        const response = await request.get("/categories/1")

        expect(response.status).toBe(200)
    })

    it("Deve retornar erro de validação ao tentar listar uma categoria que não existe", async () => {
        const response = await request.get("/categories/999")

        expect(response.status).toBe(404)
    })

    it("Deve atualizar uma categoria", async () => {
        const response = await request.put("/categories/1").set("Authorization", `Bearer ${token}`).send({
            name: "Teste Atualizado"
        })

        expect(response.status).toBe(200)
    })

    it("deve retornar erro de autorização ao tentar atualizar uma categoria sem token", async () => {
        const response = await request.put("/categories/1").send({
            name: "Teste Atualizado"
        })

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar atualizar uma categoria com dados inválidos", async () => {
        const response = await request.put("/categories/1").set("Authorization", `Bearer ${token}`).send({
            name: ""
        })

        expect(response.status).toBe(400)
    })
    
    it("Deve retornar erro ao tentar atualizar uma categoria que não existe", async () => {
        const response = await request.put("/categories/999").set("Authorization", `Bearer ${token}`).send({
            name: "Teste Atualizado"
        })

        expect(response.status).toBe(404)
    })
    
    
    it("Deve retornar erro ao tentar deletar uma categoria que não existe", async () => {
        const response = await request.delete("/categories/999").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)
    })

    it("Deve deletar uma categoria", async () => {
        const response = await request.delete("/categories/1").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
    })

    it("Deve retornar erro ao tentar criar uma categoria sem autenticação", async () => {
        const response = await request.post("/categories/").send({
            name: "Teste"
        })

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar criar uma categoria com dados inválidos", async () => {
        const response = await request.post("/categories/").set("Authorization", `Bearer ${token}`).send({
            name: ""
        })

        expect(response.status).toBe(400)
    })
})
