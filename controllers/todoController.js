const { Op } = require("sequelize");
const Todos = require("../modules/Todo");
const { redisClient } = require("../config/redis");


// INSERT TODO

const createTodos = async (req, res) => {

    try {

        const {
            title,
            description,
            priority,
            status
        } = req.body;


        // UPDATED: Get userId from JWT middleware

        const userId = req.user.id;


        const newTodo = await Todos.create({

            title,
            description,
            priority,
            status,

            // UPDATED: Save owner of this Todo

            userId
        });

       
        // UPDATED:
        // Clear only this user's Todo caches

        const keys = await redisClient.keys(
            `todos:${userId}:*`
        );

        if (keys.length > 0) {
            await redisClient.del(keys);
        }


        res.status(201).json(newTodo);

    }
    catch (err) {

        res.status(500).json({

            message: "Error on Todo creation!",

            err: err.message

        });

    }
};



// GET ALL TODOS

const getTodos = async (req, res) => {

    try {

        const {
            status,
            priority
        } = req.query;


        // UPDATED:
        // Get logged-in user's ID

        const userId = req.user.id;


        const where = {

          
            // UPDATED:
            // Only get current user's Todos

            userId: userId

        };


        if (status) {
            where.status = status;
        }


        if (priority) {
            where.priority = priority;
        }

        // UPDATED:
        // User-specific Redis cache key

        const cacheKey =
            `todos:${userId}:${status || "all"}:${priority || "all"}`;

        // Check Redis first

        const cachedTodos =
            await redisClient.get(cacheKey);


        if (cachedTodos) {

            console.log(
                "Data coming from Redis!"
            );

            return res.json(
                JSON.parse(cachedTodos)
            );
        }


        // If not found in Redis → MySQL

        console.log(
            "Data coming from MySQL"
        );


        const allTodos =
            await Todos.findAll({

                where: where

            });


        // Store result in Redis

        await redisClient.setEx(

            cacheKey,

            60,

            JSON.stringify(allTodos)

        );


        res.json(allTodos);

    }
    catch (err) {

        res.status(500).json({

            message: "Find error on todos",

            err: err.message

        });

    }
};


// GET TODO BY ID

const getTodosById = async (req, res) => {

    try {

        const id = req.params.id;


        // UPDATED:
        // Get logged-in user

        const userId = req.user.id;


        // UPDATED:
        // User-specific Todo cache

        const cachedKey =
            `todo:${userId}:${id}`;


        // Check Redis

        const cachedTodo =
            await redisClient.get(cachedKey);


        if (cachedTodo) {

            console.log(
                "Todo coming from Redis"
            );

            return res.json(
                JSON.parse(cachedTodo)
            );
        }


        // If not Redis → MySQL

        console.log(
            "Data coming from MySQL"
        );



        // UPDATED:
        // Don't use findByPk(id)
        // Because we must check ownership

        const newTodo =
            await Todos.findOne({

                where: {

                    id: id,

                    userId: userId

                }

            });


        if (!newTodo) {

            return res.status(404).json({

                message: "Todo not found"

            });

        }

        // Store in Redis

        await redisClient.setEx(

            cachedKey,

            60,

            JSON.stringify(newTodo)

        );


        res.status(200).json(newTodo);

    }
    catch (err) {

        res.status(500).json({

            message: "Error fetching todo",

            err: err.message

        });

    }
};



// DELETE TODO

const delTodos = async (req, res) => {

    try {

        const id = req.params.id;


        // UPDATED:
        // Get logged-in user

        const userId = req.user.id;


        // UPDATED:
        // Delete ONLY if Todo belongs to user

        const delTodo =
            await Todos.destroy({

                where: {

                    id: id,

                    userId: userId

                }

            });


        if (delTodo === 0) {

            return res.status(404).json({

                message: "Todo not found"

            });

        }


        // UPDATED:
        // Delete this user's Todo list caches

        const keys =
            await redisClient.keys(
                `todos:${userId}:*`
            );


        if (keys.length > 0) {

            await redisClient.del(keys);

        }


        // UPDATED:
        // Delete individual Todo cache too

        await redisClient.del(
            `todo:${userId}:${id}`
        );


        res.json({

            message: "Todo deleted successfully"

        });

    }
    catch (err) {

        res.status(500).json({

            message: "Error on deletion",

            err: err.message

        });

    }
};


// EDIT TODO

const editTodos = async (req, res) => {

    try {

        const id = req.params.id;


        const {
            title,
            description,
            priority,
            status
        } = req.body;


        // UPDATED:
        // Get logged-in user

        const userId = req.user.id;


        // UPDATED:
        // Update only user's Todo

        const [updated] =
            await Todos.update(

                {

                    title,
                    description,
                    priority,
                    status

                },

                {

                    where: {

                        id: id,

                        userId: userId

                    }

                }

            );


        if (updated === 0) {

            return res.status(404).json({

                message: "Todo not found"

            });

        }

        // Get updated Todo

        const updateId =
            await Todos.findOne({

                where: {

                    id: id,

                    userId: userId

                }

            });


        // UPDATED:
        // Clear user's Todo list caches

        const keys =
            await redisClient.keys(
                `todos:${userId}:*`
            );


        if (keys.length > 0) {

            await redisClient.del(keys);

        }


        // UPDATED:
        // Clear individual Todo cache

        await redisClient.del(
            `todo:${userId}:${id}`
        );


        res.json(updateId);

    }
    catch (err) {

        res.status(500).json({

            message: "Error updating Todo",

            err: err.message

        });

    }
};



module.exports = {

    createTodos,
    getTodos,
    getTodosById,
    delTodos,
    editTodos

};
