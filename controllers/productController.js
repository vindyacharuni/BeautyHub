import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

// Note: Make sure isAdmin is imported or defined somewhere in this file!
// import { isAdmin } from '../middleware/auth.js'; 

export async function createProduct(req, res) {
    // 1. Check Admin status
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admin can create a product"
        });
    }

    try {
        // ✅ FIX 1: Use req.body correctly
        const productData = req.body;

        // ✅ FIX 2: Handle arrays (so your Postman test works)
        if (Array.isArray(productData)) {
            const savedProducts = await Product.insertMany(productData);
            return res.status(201).json({
                message: "Products created successfully",
                products: savedProducts
            });
        }

        // Handle single product creation
        const product = new Product(productData);
        const response = await product.save();
        
        res.status(201).json({
            message: "Product created successfully",
            product: response
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Error creating product",
            error: error.message // Good for debugging!
        });
    }
}

export async function getProducts(req, res) {
    try {
        // ✅ FIX 3: Flipped the logic. Admins see all, regular users see available.
        if (isAdmin(req)) {
            const products = await Product.find();
            res.json(products);
        } else {
            const products = await Product.find({ isAvailable: true });
            res.json(products);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Error fetching products"
        });
    }
}
export async function deleteProduct(req,res){
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admin can delete a product"
        });
    }
    try {        
        const productId=req.params.productId;
        await Product.findOneAndDelete(productId);
        res.json({
            message:"Product deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Error deleting product"
        });
    }
}
export async function updateProduct(req,res){
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admin can update a product"
        });
    }
    const data=req.body;
    const productId=req.params.productId;
    data.productId=productId;
    try {  
        await Product.updateOne(
            {
                productId:productId
            },
            data
        ); 
        res.json({
            message:"Product updated successfully"
        })
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Error updating product"
            
        });
        return;
    }    
        
}
export async function getProductInfo(req,res){
    try {
        const productId=req.params.productId;
        const product=await Product.findOne({productId:productId});
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        if(isAdmin(req)){
            return res.json(product);
        }else{
            if(!product.isAvailable){
                return res.status(403).json({
                    message:"Product is not available"
                })
            }else{
                return res.json(product);
            }
                }
        
    } catch (error) {
        console.error("Error fetching product info:", error);
        res.status(500).json({
            message: "Error fetching product info"
        });
    }
}