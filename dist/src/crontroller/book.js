"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const book_1 = __importDefault(require("../model/book"));
const router = (0, express_1.Router)();
/**
 *  This function will throw error if id passed is not valid and return void otherwise
 * @param id string to validate if valid mongoose id or not
 */
const isValidMongooseId = (id) => {
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw Error("Id not valid");
    }
};
// Create a book
router.post("/books", async (req, res) => {
    try {
        const { title, author, summary } = req.body;
        const book = new book_1.default({ title, author, summary });
        await book.save();
        return res.status(201).json(book);
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while creating the book" });
    }
});
// Get a list of all books
router.get("/books", async (req, res) => {
    try {
        let query = {};
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const skip = (page - 1) * limit;
        // Sorting
        const sortField = req.query.sortField || "title";
        const sortOrder = req.query.sortOrder || "asc";
        const sortOptions = { [sortField]: sortOrder };
        // Searching
        const searchTerm = req.query.search || "";
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { author: { $regex: searchTerm, $options: "i" } },
                    { summary: { $regex: searchTerm, $options: "i" } }
                ]
            };
        }
        const totalBooks = await book_1.default.countDocuments(query);
        const books = await book_1.default.find(query).sort(sortOptions).skip(skip).limit(limit);
        return res.json({
            total: totalBooks,
            page,
            limit,
            sortField,
            sortOrder,
            books
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while retrieving the list of books" });
    }
});
// Get details of a specific book by its ID
router.get("/books/:id", async (req, res) => {
    try {
        isValidMongooseId(req.params.id);
        const book = await book_1.default.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json(book);
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while retrieving book details" });
    }
});
// Update a book's details by its ID
router.put("/books/:id", async (req, res) => {
    try {
        isValidMongooseId(req.params.id);
        const { title, author, summary } = req.body;
        const book = await book_1.default.findByIdAndUpdate(req.params.id, { title, author, summary }, {
            new: true
        });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json(book);
    }
    catch (error) {
        console.log({ error });
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while updating book details" });
    }
});
// Delete a book by its ID
router.delete("/books/:id", async (req, res) => {
    try {
        isValidMongooseId(req.params.id);
        const book = await book_1.default.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json(book);
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An error occurred while deleting the book" });
    }
});
exports.default = router;
