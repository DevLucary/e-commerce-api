require("dotenv").config()

const bcrypt = require("bcryptjs")
const User = require("./src/models/User")
const { sequelize } = require("./src/config/db")

async function seed() {
    await sequelize.sync()

    const admin = await User.findOne({
        where: { role: "admin" }
    })

    if (admin) {
        console.log("Admin already exists")
        return
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required")
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
    })

    console.log("Admin created successfully")
}

seed()
    .then(async () => {
        console.log("Seed complete")

        await sequelize.close()

        process.exit(0)
    })
    .catch(async (error) => {
        console.error(error)

        await sequelize.close()

        process.exit(1)
    })