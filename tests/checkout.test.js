const app = require("../src/app")
const supertest =require("supertest")
const request = supertest(app)
const { sequelize } = require("../src/config/db")

describe("Checkout", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    let token
    let categoryId
    let productId
    
    it ("Deve criar um usuário com sucesso", async () => {
        const response = await request.post('/users').send({
            name: "teste",
            email: "teste@email.com",
            password: "123456"
        })
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("name", "teste")
        expect(response.body).toHaveProperty("email", "teste@email.com")
        
    })
    
    
    it("Deve logar o usuário", async () => {
        const response = await request.post('/auth/login').send({
            email: "teste@email.com",
            password: "123456"
        })
        
        token = response.body.token
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("token")
        expect(response.body).toHaveProperty("user")
        expect(response.body.user).toHaveProperty("email", "teste@email.com")
    })
    
    
    it("Deve criar uma categoria", async () => {
        const response = await request.post("/categories").set('Authorization', 'Bearer ' + token).send({
            name: "tecnologia"
        })
        
        categoryId = response.body.id
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("name", "tecnologia")
    })
    
    
    it("Deve criar um produto", async () => {
        const response = await request.post("/products").set('Authorization', 'Bearer ' + token).send({
            title: "Mouse USB",
            price: 14.99,
            categoryId: categoryId,
            stock:30
        })
        
        productId = response.body.id
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("title", "Mouse USB")
        expect(response.body).toHaveProperty("price", 14.99)
        expect(response.body).toHaveProperty("categoryId")
        expect(response.body).toHaveProperty("stock", 30)
    })
    
    it("Deve adicionar um produto ao carrinho", async () => {
        const response = await request.post("/cart/items").set('Authorization', 'Bearer ' + token).send({
            productId: productId,
            quantity: 20
        })
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("productId")
        expect(response.body).toHaveProperty("quantity")
        expect(response.body).toHaveProperty("price")
    })
    
    it("Deve realizar o checkout", async () => {
        const response = await request.post("/order").set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("userId")
        expect(response.body).toHaveProperty("orderId")
        expect(response.body).toHaveProperty("total")
        expect(response.body).toHaveProperty("products")
    })
    
})