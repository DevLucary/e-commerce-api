const app = require("../src/app")
const request = require("supertest")(app)
const { sequelize } = require("../src/config/db")
const fs = require("fs/promises")

describe("Products", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    let token
    let categoryId
    let categoryId2

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
            name: "Eletrônicos"
        })

        categoryId = response.body.id
        
        
        expect(response.status).toBe(201)
    })

    it("Deve criar outra categoria", async () => {
        const response = await request.post("/categories").set("Authorization", `Bearer ${token}`).send({
            name: "Roupas"
        })
        
        categoryId2 = response.body.id
        
        expect(response.status).toBe(201)
    })
    
    it("Deve listar todos os produtos", async () => {
        const response = await request.get("/products")
        
        expect(response.status).toBe(200)
    })
    
    it("Deve criar novos produtos", async () => {
        
        const products = [
            {
                title: "Mouse RGB",
                price: 100,
                categoryId: categoryId,
                stock: 10
            },
            {
                title: "Teclado RGB",
                price: 50,
                categoryId: categoryId,
                stock: 20
            },
            {
                title: "Camiseta",
                price: 70,
                categoryId: categoryId2,
                stock: 50
            },
            {
                title: "Calça",
                price: 20,
                categoryId: categoryId2,
                    stock: 100
            },
            {
                title: "Tênis",
                price: 300,
                categoryId: categoryId2,
                stock: 30
            },
            {
                title: "Monitor",
                price: 500,
                categoryId: categoryId,
                stock: 40
            }
        ]

        for (const p of products) {
           const response = await request.post('/products')
                .set('Authorization', 'Bearer ' + token)
                .send(p)

                expect(response.status).toBe(201)
        }
        
    })
    
    it("Deve ordenar produtos por preço crescente", async () => {
        const response = await request.get("/products?sort=price&order=asc")
    
        expect(response.status).toBe(200)

        const products = response.body.products
    
        const prices = products.map(p => Number(p.price))
    
        for (let i = 0; i < prices.length - 1; i++) {

            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1])
        }
    })

    it("Deve ordenar produtos por preço decrescente", async () => {
        const response = await request.get("/products?sort=price&order=desc")
    
        expect(response.status).toBe(200)

        const products = response.body.products
    
        const prices = products.map(p => Number(p.price))
    
        for (let i = 0; i < prices.length - 1; i++) {

            expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1])
        }
    })

    it("Deve retornar a primeira página com 3 produtos", async () => {
        const response = await request.get("/products?page=1&limit=3")
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(3)
        expect(response.body.pagination.page).toBe(1)
        expect(response.body.pagination.limit).toBe(3)
        expect(response.body.pagination.total).toBe(6)
        expect(response.body.pagination.totalPages).toBe(2)
    })

    it("Deve retornar a segunda página com 3 produtos", async () => {
        const response = await request.get("/products?page=2&limit=3")
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(3)
        expect(response.body.pagination.page).toBe(2)
        expect(response.body.pagination.limit).toBe(3)
        expect(response.body.pagination.total).toBe(6)
        expect(response.body.pagination.totalPages).toBe(2)
    })

    it("Deve retornar produtos com a categoria eletrônicos", async () => {
        const response = await request.get(`/products?category=${categoryId}`)
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(3)
        expect(products.every(p => p.categoryId === categoryId)).toBe(true);
    })

    it("Deve retornar produtos com a categoria roupas", async () => {
        const response = await request.get(`/products?category=${categoryId2}`)
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(3)
        expect(products.every(p => p.categoryId === categoryId2)).toBe(true);
    })

    it("Deve retornar produtos que tenham o filtro do título", async () => {
        const response = await request.get("/products?title=RGB")
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(2)
        expect(products.every(p => p.title.includes("RGB"))).toBe(true);
    })

    it("Deve retornar produtos com o filtro de preço mínimo", async () => {
        const response = await request.get("/products?minPrice=100")
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(3)
        expect(products.every(p => p.price >= 100)).toBe(true);
    })

    it("Deve retornar produtos com o filtro de preço máximo", async () => {
        const response = await request.get("/products?maxPrice=50")
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(2)
        expect(products.every(p => p.price <= 50)).toBe(true);
    })

    it("Deve retornar produtos com todos os filtros", async () => {
        const response = await request.get(`/products?category=${categoryId}&title=RGB&minPrice=100&maxPrice=500`)
        
        expect(response.status).toBe(200)
        
        const products = response.body.products
        
        expect(products.length).toBe(1)
        expect(products.every(p => p.categoryId === categoryId && p.title.includes("RGB") && p.price >= 100 && p.price <= 500)).toBe(true);
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