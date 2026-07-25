const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")
const bcrypt = require("bcryptjs")
const User = require("../src/models/User")

describe("Categories", () => {
    let adminToken

   beforeAll(async () => {
    await sequelize.sync({ force: true })

    const hashedPassword = await bcrypt.hash("123456", 10)

    await User.create({
      name: "Admin",
      email: "admin@email.com",
      password: hashedPassword,
      role: "admin"
    })

    const loginResponse = await request.post("/auth/login").send({
      email: "admin@email.com",
      password: "123456",
    })

    adminToken = loginResponse.body.token
  })

    it("Deve listar todas as categorias", async () => {
        const response = await request.get("/categories")

        expect(response.status).toBe(200)
    })
    
    it("Deve criar uma nova categoria", async () => {
        const response = await request.post("/categories/").set("Authorization", `Bearer ${adminToken}`).send({
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
        const response = await request.put("/categories/1").set("Authorization", `Bearer ${adminToken}`).send({
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
        const response = await request.put("/categories/1").set("Authorization", `Bearer ${adminToken}`).send({
            name: ""
        })

        expect(response.status).toBe(400)
    })
    
    it("Deve retornar erro ao tentar atualizar uma categoria que não existe", async () => {
        const response = await request.put("/categories/999").set("Authorization", `Bearer ${adminToken}`).send({
            name: "Teste Atualizado"
        })

        expect(response.status).toBe(404)
    })
    
    
    it("Deve retornar erro ao tentar deletar uma categoria que não existe", async () => {
        const response = await request.delete("/categories/999").set("Authorization", `Bearer ${adminToken}`)

        expect(response.status).toBe(404)
    })

    it("Deve deletar uma categoria", async () => {
        const response = await request.delete("/categories/1").set("Authorization", `Bearer ${adminToken}`)

        expect(response.status).toBe(200)
    })

    it("Deve retornar erro ao tentar criar uma categoria sem autenticação", async () => {
        const response = await request.post("/categories/").send({
            name: "Teste"
        })

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar criar uma categoria com dados inválidos", async () => {
        const response = await request.post("/categories/").set("Authorization", `Bearer ${adminToken}`).send({
            name: ""
        })

        expect(response.status).toBe(400)
    })
})
