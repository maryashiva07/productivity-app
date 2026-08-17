const {createClient} = require("redis");
require("dotenv").config();

const redisClient = createClient({
     url: process.env.REDIS_URL
});

redisClient.on("error", (err)=>{
     console.log("Redis error : ", err);
})

async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected successfully!");
}


module.exports = {
     redisClient,
     connectRedis
};
