const express = require("express")
const cors = require("cors")
const squlet3 = require("sqlite3")

const app = express()
const PORT = 8888;

app.use(cors(),express.json())


const DB = new squlet3.Database("./dataBase.db");

// DB.serialize(()=>{
//     DB.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT)")
// })

app.post("/data",(req,res)=>{
    const {name, phone} = req.body
const insertQuery = "INSERT INTO users (name, phone) VALUES (?,?);"
DB.run(insertQuery,[name,phone],(err)=>{
    if(err){
        res.status(500).send("DB ERROR")
    }else{
        res.status(200).send("ALL IS OKAY")
    }

})
    
})
app.get("/users",(req,res)=>{
    const seleqtQuery = "SELECT * FROM users"
    DB.all(seleqtQuery,(err,rows)=>{
        if(err){
            res.status(500).send("ERROR IN GET USERS")
        }
        else{
            res.status(200).send(rows)
        }
    })
   
})

app.listen(PORT,()=>{
            console.log(`server is running on http://localhost:${PORT} `);
})