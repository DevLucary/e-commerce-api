const app = require("../src/app")
const supertest =require("supertest")
const request = supertest(app)
const { sequelize } = require("../src/config/db")
const Product = require("../src/models/Product")
const bcrypt = require("bcryptjs")
const User = require("../src/models/User")

describe("Orders", () => {
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
            password: "123456"
        })

        adminToken = loginResponse.body.token
    })

    let token
    let token2
    let categoryId
    let productId
    
    it ("Deve criar um usuário com sucesso", async () => {
        const response = await request.post('/users').send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })
        
        expect(response.status).toBe(201)
    })
    
    it("Deve criar outro usuário", async () => {
        const response = await request.post('/users').send({
            name: "teste2",
            email: "teste2@email.com",
            password: "123456"
        })
        
        expect(response.status).toBe(201)
    })

    it("Deve logar o outro usuário", async () => {
        const response = await request.post('/auth/login').send({
            email: "teste2@email.com",
            password: "123456"
        })
        
        token2 = response.body.token
        
        expect(response.status).toBe(200)
    })
    
    it("Deve logar o usuário", async () => {
        const response = await request.post('/auth/login').send({
            email: "teste@email.com",
            password: "123456"
        })
        
        token = response.body.token
        
        expect(response.status).toBe(200)
    })
    
    it("Deve criar uma categoria", async () => {
        const response = await request.post("/categories").set('Authorization', 'Bearer ' + adminToken).send({
            name: "tecnologia"
        })
        
        categoryId = response.body.id
        
        expect(response.status).toBe(201)
    })
    
    it("Deve criar um produto", async () => {
        const response = await request.post("/products").set('Authorization', 'Bearer ' + adminToken).send({
            title: "Mouse USB",
            price: 14.99,
            categoryId: categoryId,
            stock:30
        })
        
        productId = response.body.id
        
        expect(response.status).toBe(201)
    })
    
    it("Deve adicionar um produto ao carrinho", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + token).send({
            productId: productId,
            quantity: 2
        })
        
        expect(response.status).toBe(201)
    })
    
    it("Deve realizar o checkout", async () => {
        const response = await request.post("/order").set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(201)
    })

    it("Deve retornar pedidos", async () => {
        const response = await request.get("/order").set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)

        const order = response.body[0]

        expect(order).toHaveProperty('id')
        expect(order).toHaveProperty('total')
        expect(order).toHaveProperty('status', 'pending')
        expect(order).toHaveProperty('orderItems')

        const items = order.orderItems

        expect(items).toHaveLength(1)

        const item = items[0]

        expect(item).toHaveProperty('productId', productId)
        expect(item).toHaveProperty('quantity', 2)
        expect(Number(item.price)).toBe(14.99)
        expect(item).toHaveProperty('product')
        expect(item.product).toHaveProperty('title', 'Mouse USB')
    })

    it("Deve retornar pedidos do outro usuário", async () => {
        const response = await request.get("/order").set('Authorization', 'Bearer ' + token2)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(0)
    })

    it("Deve retornar erro de token", async () => {
        const response = await request.get("/order")

        expect(response.status).toBe(401)
    })
})