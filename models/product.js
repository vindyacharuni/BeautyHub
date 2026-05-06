import mongoose from "mongoose";
const productSchema=new mongoose.Schema(
    {
        productId:{
            Type:String,
            required:true,
            unique:true
        },
        name:{
            Type:String,
            required:true
        },
        altNames:{ 
            Type:[String],
            default:[]
        },
        labelledPrice:{
            Type:Number,
            required:true
        },
        price:{
            Type:Number,
            required:true
        },
        images:{
            Type:[String],
            default:["/default-product.jpg"]
        },
        description:{
            Type:String,
            required:true
        },
        category:{
            Type:String,
            required:true
        },
        stock:{
            Type:Number,
            required:true
        },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   


    })
const Product=mongoose.model("products",productSchema)
export default Product;