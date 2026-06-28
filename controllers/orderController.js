import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "please login to place an order" });
        }

        const lastOrder = await Order.find().sort({ date: -1 }).limit(1);
        let orderId = "CB00202";
        if (lastOrder.length > 0) {
            const lastOrderIdString = lastOrder[0].orderId || "";
            const lastOrderIdNumber = parseInt(lastOrderIdString.replace(/^CB/, "")) || 0;
            const newOrderIdNumber = lastOrderIdNumber + 1;
            orderId = "CB" + newOrderIdNumber.toString().padStart(5, "0");
        }

        const itemsInput = req.body.items;
        if (!itemsInput || !Array.isArray(itemsInput) || itemsInput.length === 0) {
            return res.status(400).json({ message: "Items are required to place an order" });
        }

        const items = [];
        for (const it of itemsInput) {
            const { productId, quantity } = it;
            // Validate only productId and quantity as requested
            if (!productId || typeof quantity !== "number") {
                return res.status(400).json({ message: "Invalid item format: productId and quantity required", item: it });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: "Item quantity must be at least 1", item: it });
            }

            // Enrich item with product details from Product collection
            const product = await Product.findOne({ productId: productId });
            if (!product) {
                return res.status(400).json({ message: `Product not found: ${productId}`, item: it });
            }

            const name = product.name || "";
            const price = typeof product.price === 'number' ? product.price : 0;
            const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "";

            items.push({ productId, quantity, name, price, image });
        }

        const total = items.reduce((sum, it) => sum + it.quantity * (typeof it.price === 'number' ? it.price : 0), 0);

        const order = new Order({
            orderId: orderId,
            email: req.user.email,
            name: req.user.firstName + " " + req.user.lastName,
            address: req.body.address || "",
            phone: req.body.phone || "",
            items: items,
            note: req.body.note || undefined,
            total: total,
        });

        const result = await order.save();
        res.json({ message: "Order created successfully", result: result });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
}
export async function getOrders(req,res){
    try{
        if(!req.user){
            return res.status(401).json({ message: "Please login to view orders" });
        }

        let orders;
        if(req.user.role && req.user.role === 'admin'){
            orders = await Order.find().sort({ date: -1 });
        } else {
            orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
        }

        return res.json({ orders });
    }catch(error){
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}
