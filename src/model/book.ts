import mongoose, { Schema } from "mongoose"
import "dotenv/config"

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI ?? "")

// Define the Book schema
const bookSchema = new Schema<IBook>({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    author: {
        type: String,
        required: [true, "Author is required"]
    },
    summary: String
})

// Define the Book type
export interface IBook extends Document {
    title: string
    author: string
    summary: string
}

const Book = mongoose.model<IBook>("Book", bookSchema)
export default Book
