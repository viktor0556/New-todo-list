"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const pool = new pg_1.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401);
    }
    if (token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Token Verification Error:", err.message);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
};
router.get("/todos", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const allTodos = yield pool.query("SELECT * FROM todos WHERE user_id = $1", [userId]);
        res.json(allTodos.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/todos", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { description, selectedtime } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const newTodo = yield pool.query("INSERT INTO todos (description, selectedtime, user_id) VALUES($1, $2, $3) RETURNING *", [description, selectedtime, userId]);
        res.json(newTodo.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/guest-todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTodos = yield pool.query("SELECT * FROM todos WHERE user_id IS NULL");
        res.json(allTodos.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/guest-todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, selectedtime } = req.body;
        const newTodo = yield pool.query("INSERT INTO todos (description, selectedtime) VALUES($1, $2) RETURNING *", [description, selectedtime]);
        res.json(newTodo.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { description, completed, selectedtime } = req.body;
        yield pool.query("UPDATE todos SET description = $1, completed = $2, selectedtime = $3 WHERE id = $4", [description, completed, selectedtime, id]);
        res.json("Todo was updated!");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield pool.query("DELETE FROM todos WHERE id = $1", [id]);
        res.json("Todo was deleted!");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
