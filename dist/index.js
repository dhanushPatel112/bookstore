"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const book_1 = __importDefault(require("./src/crontroller/book"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT ?? 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// API
app.use(book_1.default);
// App listening on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
