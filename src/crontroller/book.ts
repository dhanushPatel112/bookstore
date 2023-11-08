import { Request, Response, Router } from "express"
import mongoose, { MongooseError, isValidObjectId } from "mongoose"
import Book, { IBook } from "../model/book"

const router = Router()

const isValidMongooseId = (id: string) => {
    if (!isValidObjectId(id)) {
        throw Error("Id not valid")
    }
}

router.post("/books", async (req: Request, res: Response) => {
    try {
        const { title, author, summary }: IBook = req.body
        const book = new Book({ title, author, summary })
        await book.save()
        return res.status(201).json(book)
    } catch (error) {
        if (error instanceof MongooseError) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: "An error occurred while creating the book." })
    }
})

// Get a list of all books
router.get("/books", async (req: Request, res: Response) => {
    try {
        let query = {}

        // Pagination
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 0
        const skip = (page - 1) * limit

        // Sorting
        const sortField = (req.query.sortField as string) || "title"
        const sortOrder = (req.query.sortOrder as mongoose.SortOrder) || "asc"
        const sortOptions: any = { [sortField]: sortOrder }

        // Searching
        const searchTerm = (req.query.search as string) || ""

        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { author: { $regex: searchTerm, $options: "i" } },
                    { summary: { $regex: searchTerm, $options: "i" } }
                ]
            }
        }

        const totalBooks = await Book.countDocuments(query)
        const books = await Book.find(query).sort(sortOptions).skip(skip).limit(limit)

        res.json({
            total: totalBooks,
            page,
            limit,
            sortField,
            sortOrder,
            books
        })
    } catch (error) {
        if (error instanceof MongooseError) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: "An error occurred while retrieving the list of books." })
    }
})

// Get details of a specific book by its ID
router.get("/books/:id", async (req: Request, res: Response) => {
    try {
        isValidMongooseId(req.params.id)
        const book: IBook | null = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({ error: "Book not found" })
        }
        return res.json(book)
    } catch (error) {
        if (error instanceof MongooseError) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: "An error occurred while retrieving book details." })
    }
})
// Update a book's details by its ID
router.put("/books/:id", async (req: Request, res: Response) => {
    try {
        isValidMongooseId(req.params.id)
        const book: IBook | null = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if (!book) {
            return res.status(404).json({ error: "Book not found" })
        }
        res.json(book)
    } catch (error) {
        console.log({ error })
        if (error instanceof MongooseError) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: "An error occurred while updating book details." })
    }
})

// Delete a book by its ID
router.delete("/books/:id", async (req: Request, res: Response) => {
    try {
        isValidMongooseId(req.params.id)
        const book: IBook | null = await Book.findByIdAndDelete(req.params.id)
        if (!book) {
            return res.status(404).json({ error: "Book not found" })
        }
        res.json(book)
    } catch (error) {
        if (error instanceof MongooseError) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ error: "An error occurred while deleting the book." })
    }
})

export default router
