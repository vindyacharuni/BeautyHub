import express from 'express';
import mongoose from 'mongoose';   
import bodyParser from 'body-parser'; 
import userRouter from './Routers/userRouter.js';
import jwt from 'jsonwebtoken';
import productRouter from './Routers/productRouter.js';
import dotenv from 'dotenv';

dotenv.config();

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


const connectionString=process.env.MONGO_URL;
mongoose.connect(connectionString).then
(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});


app.use('api/users',userRouter)
app.use('api/products',productRouter)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})