import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function createUser(req, res) {
    if(req.user==null){
        return res.status(403).json({
            message: "Please login to create a user"
        })
        return  

    }
    if(req.user.role!="admin"){
        return res.status(403).json({
            message: "Only admin can create a user"
        })
        return
    }
    const passwordHash=bcrypt.hashSync(req.body.password,10)

    const userData={
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:passwordHash,
        phone:req.body.phone
    }

const user=new User(userData)
    
user.save().then(()=>{
    res.json(
        {
            message:"User created successfully"
        }
    )
}).catch((error)=>{
    res.status(500).json(
        {
            message:"Error creating user"
        }
    )
})}
export function isAdmin(req){
    if(req.user==null){
        return false
    }
    if(req.user.role=="admin"){
        return true
    }else{
        return false
    }
}

export function loginUser(req,res){
    const email=req.body.email;
    const password=req.body.password;

    User.findOne(
        {
            email:email
        }).then((user)=>{
            if(user==null){
                res.status(404).json({
                    message:"User not found"
            })}else{
                const isPasswordCorrect=bcrypt.compareSync(password,user.password);
                if(isPasswordCorrect){
                    const token=jwt.sign(
                    {
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        role:user.role,
                        isBlocked:user.isBlocked,
                        isemailVerified:user.isemailVerified,
                       image:user.profilePicture
                    },
                    "cbc-6503"
                )
                    res.json({
                        token:token,
                        message:"Login successful"
                    })
                }else{
                    res.status(403).json({
                        message:"Invalid password"
                    })
                }
            }
       

        })
    }