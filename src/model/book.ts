import mongoose, { Schema } from "mongoose"

// Connect to MongoDB (replace with your database connection URL)
mongoose.connect("mongodb://localhost/books-api")

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
    summary: String // 'summary' is not required
})

// Define the Book model
export interface IBook extends Document {
    title: string
    author: string
    summary: string
}

const Book = mongoose.model<IBook>("Book", bookSchema)
export default Book
