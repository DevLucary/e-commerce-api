const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")
const fs = require("fs/promises")

describe("Products", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    let token

    it("Deve criar o usuário", async () => {
        const response = await request.post("/users").send({
            name: "Teste",
            email: "teste@teste.com",
            password: "123456"
        })
        
        expect(response.status).toBe(201)
    })

    it("Deve fazer login", async () => {
        const response = await request.post("/auth/login").send({
            email: "teste@teste.com",
            password: "123456"
        })

        token = response.body.token
        
        expect(response.status).toBe(200)
    })

    it("deve criar uma categoria", async () => {
        const response = await request.post("/categories").set("Authorization", `Bearer ${token}`).send({
            name: "Teste"
        })
        
        expect(response.status).toBe(201)
    })
    
    it("Deve listar todos os produtos", async () => {
        const response = await request.get("/products")
        
        expect(response.status).toBe(200)
    })

    it("Deve criar um novo produto", async () => {
        const response = await request.post("/products").set("Authorization", `Bearer ${token}`).send({
            title: "Teste",
            price: 100,
            categoryId: 1,
            stock: 10
        }) 
        
        expect(response.status).toBe(201)
    })

    it("Deve retornar erro de autorização quando não fornecer token", async () => {
        const response = await request.post("/products").send({
            title: "Teste",
            price: 100,
            categoryId: 1,
            stock: 10
        })
        
        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação quando não fornecer dados válidos", async () => {
        const response = await request.post("/products").set("Authorization", `Bearer ${token}`).send({
            title: "",
            price: -100,
            categoryId: -1,
            stock: -10
        })
        
        expect(response.status).toBe(400)
    })

    it("Deve retornar erro de categoria não encontrada", async () => {
        const response = await request.post("/products").set("Authorization", `Bearer ${token}`).send({
            title: "Teste",
            price: 100,
            categoryId: 999,
            stock: 10
        })

        expect(response.status).toBe(404)
    })

    it("Deve listar um produto específico", async () => {
        const response = await request.get("/products/1")
        
        expect(response.status).toBe(200)
    })

    it("Deve retornar erro de validação ao tentar listar um produto que não existe", async () => {
        const response = await request.get("/products/999")

        expect(response.status).toBe(404)
    })

    it("Deve atualizar a imagem do produto", async () => {
        const response = await request.patch("/products/1/upload").set("Authorization", `Bearer ${token}`).attach("image", "test.png")

        expect(response.status).toBe(200)
    })

    it("Deve retornar erro de validação ao tentar atualizar a imagem de um produto que não existe", async () => {
        const response = await request.patch("/products/999/upload").set("Authorization", `Bearer ${token}`).attach("image", "test.png")

        expect(response.status).toBe(404)
    })

    it("Deve retornar erro de autorização ao tentar atualizar a imagem sem token", async () => {
        const response = await request.patch("/products/1/upload").attach("image", "test.png")

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar atualizar a imagem sem arquivo", async () => {
        const response = await request.patch("/products/1/upload").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(400)
    })

    it("Deve atualizar um produto", async () => {
        const response = await request.put("/products/1").set("Authorization", `Bearer ${token}`).send({
            title: "Teste Atualizado",
            price: 200,
            categoryId: 1,
            stock: 20
        })
        
        expect(response.status).toBe(200)
    })

    it("Deve retornar erro de validação ao tentar atualizar um produto sem token", async () => {
        const response = await request.put("/products/1").send({
            title: "Teste Atualizado",
            price: 200,
            categoryId: 1,
            stock: 20
        })

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar atualizar um produto sem dados", async () => {
        const response = await request.put("/products/1").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(400)
    }) 

    it("Deve retornar erro de validação ao tentar atualizar um produto que não existe", async () => {
        const response = await request.put("/products/999").set("Authorization", `Bearer ${token}`).send({
            title: "Teste Atualizado",
            price: 200,
            categoryId: 1,
            stock: 20
        })

        expect(response.status).toBe(404)
    })

    it("Deve retornar erro de autorização ao tentar deletar um produto sem token", async () => {
        const response = await request.delete("/products/1")

        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao tentar deletar um produto que não existe", async () => {
        const response = await request.delete("/products/999").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)
    })
    
    it("Deve deletar um produto", async () => {
        const response = await request.delete("/products/1").set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200)
    })

    afterAll(async () => {
        const nomes = await fs.readdir("images/products")

        for (const nome of nomes) {
            await fs.unlink(`images/products/${nome}`)
        }
    })

})