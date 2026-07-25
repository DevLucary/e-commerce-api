const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")
const bcrypt = require("bcryptjs")
const User = require("../src/models/User")

describe("Cart", () => {
    let adminToken

    beforeAll( async () => {
        await sequelize.sync({ force: true })

        const hashedPasword = await bcrypt.hash("123456", 10)

    await User.create({
        name: "Admin",
        email: "admin@email.com",
        password: hashedPasword,
        role: "admin"
    })

    const loginResponse = await request.post("/auth/login").send({
       email: "admin@email.com",
       password: "123456" 
    })

    adminToken =loginResponse.body.token
    })
    
    it("Deve criar uma categoria", async () => {
        const response = await request.post("/categories").set('Authorization', 'Bearer ' + adminToken).send({
            name: "tecnologia"
        })
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("name", "tecnologia")
    })
    
    
    it("Deve criar um produto", async () => {
        const response = await request.post("/products").set('Authorization', 'Bearer ' + adminToken).send({
            title: "Mouse USB",
            price: 14.99,
            categoryId: 1,
            stock:30
        })
        
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("title", "Mouse USB")
        expect(response.body).toHaveProperty("price", 14.99)
        expect(response.body).toHaveProperty("categoryId")
        expect(response.body).toHaveProperty("stock", 30)
    })
    
    it("Deve adicionar um produto ao carrinho", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + adminToken).send({
            productId: 1,
            quantity: 20
        })
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("productId")
        expect(response.body).toHaveProperty("quantity")
        expect(response.body).toHaveProperty("price")
    })

    it("Deve retornar erro de autorização ao adicionar produto ao carrinho sem token", async () => {
        const response = await request.post("/cart/items").send({
            productId: 1,
            quantity: 20
        })
        
        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de validação ao adicionar produto ao carrinho sem dados", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + adminToken).send({})
        
        expect(response.status).toBe(400)
    })

    it("Deve retornar erro de produto não encontrado", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + adminToken).send({
            productId: 999,
            quantity: 10
        })
        
        expect(response.status).toBe(404)
    })

    it("Deve retornar erro de estoque insuficiente", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + adminToken).send({
            productId: 1,
            quantity: 999
        })
        
        expect(response.status).toBe(400)
    })

    it("Deve listar os itens do carrinho", async () => {
        const response = await request.get("/cart/items").set('Authorization', 'Bearer ' + adminToken)
        
        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty("productId")
        expect(response.body[0]).toHaveProperty("quantity")
        expect(response.body[0]).toHaveProperty("price")
    })

    it("Deve retornar erro de autorização ao listar itens do carrinho sem token", async () => {
        const response = await request.get("/cart/items")
        
        expect(response.status).toBe(401)
    })

    it("Deve retornar o total do carrinho", async () => {
        const response = await request.get("/cart/items/calculate").set('Authorization', 'Bearer ' + adminToken)
        
        expect(response.status).toBe(200)
    })

    it("Deve retornar erro de autorização ao obter total do carrinho sem token", async () => {
        const response = await request.get("/cart/items/calculate")
        
        expect(response.status).toBe(401)
    })

    it("Deve atualizar a quantidade de um item no carrinho", async () => {
        const response = await request.put("/cart/items/1").set('Authorization', 'Bearer ' + adminToken).send({
            quantity: 10
        })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("quantity", 10)
    })

    it("Deve retornar erro de autorização ao atualizar item do carrinho sem token", async () => {
        const response = await request.put("/cart/items/1").send({
            quantity: 10
        })
        
        expect(response.status).toBe(401)
    })

    it("deve retornar erro de validação ao atualizar item do carrinho sem dados", async () => {
        const response = await request.put("/cart/items/1").set('Authorization', 'Bearer ' + adminToken).send({})
        
        expect(response.status).toBe(400)
    })

    it("Deve retornar erro de produto não encontrado ao atualizar item do carrinho", async () => {
        const response = await request.put("/cart/items/999").set('Authorization', 'Bearer ' + adminToken).send({
            quantity: 10
        })
        
        expect(response.status).toBe(404)
    })

    it("Deve retornar erro de estoque insuficiente ao atualizar item do carrinho", async () => {
        const response = await request.put("/cart/items/1").set('Authorization', 'Bearer ' + adminToken).send({
            quantity: 999
        })
        
        expect(response.status).toBe(400)
    })

    it("Deve retornar erro de autorização ao remover item do carrinho sem token", async () => {
        const response = await request.delete("/cart/items/1")
        
        expect(response.status).toBe(401)
    })

    it("Deve retornar erro de item não encontrado ao remover item do carrinho", async () => {
        const response = await request.delete("/cart/items/999").set('Authorization', 'Bearer ' + adminToken)
        
        expect(response.status).toBe(404)
    })

    it("Deve remover um item do carrinho", async () => {
        const response = await request.delete("/cart/items/1").set('Authorization', 'Bearer ' + adminToken)
        
        expect(response.status).toBe(200)
    })

    it("Deve calcular o total do carrinho após remoção", async () => {
        const response = await request.get("/cart/items/calculate").set('Authorization', 'Bearer ' + adminToken)
        
        expect(response.status).toBe(200)
        expect(response.body).toBe(0)
    })

})