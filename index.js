import express from 'express';
import mongoose from 'mongoose';   
import bodyParser from 'body-parser'; 
import userRouter from './Routers/userRouter.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
   
    const value = req.header("Authorization");
    console.log(value)
    if(value!=null){
    const token = value.replace("Bearer ", "");
    jwt.verify(token, "cbc-6503", (err, decoded) => {
        console.log(decoded)
        if (decoded == null) {
            res.status(403).json({
                message: "Unauthorized"
            })
        } else {
            req.user = decoded;
            next();
        }
    })
    }else{
        next()
    }
    
  
}
)


const connectionString="mongodb://admin:1234@ac-btmly6v-shard-00-00.h2t2pay.mongodb.net:27017,ac-btmly6v-shard-00-01.h2t2pay.mongodb.net:27017,ac-btmly6v-shard-00-02.h2t2pay.mongodb.net:27017/?ssl=true&replicaSet=atlas-14d1co-shard-0&authSource=admin&appName=Cluster0"
mongoose.connect(connectionString).then
(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});


app.use('/users',userRouter)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})