// app.ts
import express from "express"
import bodyParser from "body-parser"
import bookController from "./src/crontroller/book"
import "dotenv/config"

const app = express()
const port = process.env.PORT ?? 3000
app.use(bodyParser.json())

// API
app.use(bookController)

// App listening on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
