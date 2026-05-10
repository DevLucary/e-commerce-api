const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/products")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.round(Math.random() * 1E9) + "-" + file.originalname)
    }
})
const upload = multer({ storage, fileFilter: (req,file,cb) => {
       if (file.mimetype.includes( "image/")){
            cb(null,true)
        } else {
            cb(new Error('Tipo de arquivo não permitido'))
        }
}})

module.exports = upload.single("image")