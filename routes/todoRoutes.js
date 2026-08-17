const express = require("express");
const router = express.Router();


const authenticateUser = require("../middleware/authMiddleware");

const {createTodos,
    getTodos,
    getTodosById,
    delTodos,
    editTodos} = require("../controllers/todoController");


//Create todos
router.post("/todos", authenticateUser, createTodos);

//get All todos
router.get("/todos", authenticateUser, getTodos);

//get Todos By Id
router.get("/todos/:id", authenticateUser, getTodosById);

//Delete todos
router.delete("/todos/:id", authenticateUser, delTodos);

//Edit todos
router.put("/todos/:id", authenticateUser, editTodos);

module.exports = router;