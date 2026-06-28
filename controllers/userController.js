import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Order from "../models/order.js";
import Product from "../models/product.js";

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
                   process.env.JWT_SECRET
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

export function registerUser(req, res) {
    const { firstName, lastName, email, password, phone } = req.body || {};
    
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "First name, last name, email, and password are required"
        });
    }

    User.findOne({ email: email }).then((existingUser) => {
        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        const userData = {
            firstName,
            lastName,
            email,
            password: passwordHash,
            phone: phone || "Not provided"
        };

        const user = new User(userData);
        
        user.save().then(() => {
            res.status(201).json({
                message: "Registration successful"
            });
        }).catch((error) => {
            res.status(500).json({
                message: "Error registering user"
            });
        });
    }).catch((error) => {
        res.status(500).json({
            message: "Database error occurred"
        });
    });
}

export async function getDashboardStats(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please login to view dashboard statistics" });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can view dashboard statistics" });
        }

        // Calculate Total Revenue
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Count Products
        const totalProducts = await Product.countDocuments();

        // Count Categories
        const categories = await Product.distinct("category");
        const totalCategories = categories.length;

        // Count Low Stock (under 15 units)
        const lowStockCount = await Product.countDocuments({ stock: { $lt: 15 } });

        // Count Users (role === 'user')
        const totalUsers = await User.countDocuments({ role: "user" });

        // Retrieve last 5 orders for activity logs
        const recentOrders = await Order.find().sort({ date: -1 }).limit(5);

        res.json({
            totalRevenue,
            totalProducts,
            totalCategories,
            lowStockCount,
            totalUsers,
            recentOrders
        });
    } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics", error: error.message });
    }
}