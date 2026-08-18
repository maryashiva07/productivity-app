const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const todoRoutes = require("./routes/todoRoutes");
const sequelize = require("./config/database");
const {connectRedis} = require("./config/redis");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", authRoutes);

app.use("/api", todoRoutes);

//intial rendering
app.get("/", (req, res)=>{
     res.sendFile(path.join(__dirname, "public", "login.html"));
})

const PORT = process.env.PORT||6555;

async function startServer(){
     try{
           await sequelize.authenticate();
           console.log("database is connected!");

        //    await sequelize.sync();
        await sequelize.sync({ alter: true });
           console.log("table is sync");

           await connectRedis();

           app.listen(PORT, "0.0.0.0", ()=>{
              console.log("app is running on port: ", PORT);
           })
     }
     catch(err){
         console.log("found error on database connection :", err);
     }
};


startServer();
