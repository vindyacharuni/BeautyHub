import mongoose from "mongoose";
const orderSchema=new mongoose.Schema(
    {
        orderId:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true,
            default:"pending"
        },
        date:{
            type:Date,
            default:Date.now            
        },
        items:[
            {
                productId:{
                    type:String,
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },
                name:{
                    type:String,
                    required:false,
                    default: ""
                },
                price:{
                    type:Number,
                    required:false,
                    default: 0
                },
                image:{
                    type:String,
                    required:false,
                    default: ""
                }
            }
        ],
        note:{
            type:String,
            default:"no additional notes"
        },
        total:{
            type:Number,
            default:0
        }
    })
    const Order=mongoose.model("orders",orderSchema)
export default Order;