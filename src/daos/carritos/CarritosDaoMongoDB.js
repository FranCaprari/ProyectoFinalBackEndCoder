import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js";
import { Schema } from "mongoose";
import logger from "../../logger/log4JS.js"


const products = new Schema({
    id_prod: { type: String, required:true },
    timestamp: { type: Date, required:true },
    name: { type: String, required:true },
    description: { type: String, required:true },
    thumbnail: { type: String, required:true },
    price: { type: Number, required:true },
    quantity: { type: Number, default: 1 },
    stock: { type: Number, required:true }, 
    category: { type: String, required: true }
})

class CarritosDaoMongoDB extends ContenedorMongoDB {
    constructor(){
        super ("carritos", {
            id: { type: String },
            timestamp: { type: Date, required:true },
            id_user: { type: String, required: true },
            terminado: { type: Boolean, default: false },
            products: [products]
        })
    }

    async saveProducts(id, id_prod, timestamp, name, description, thumbnail, price, quantity, category, stock){
        try {
            const cart = await this.collection.findOne({ _id:id })
            const { products } = cart;
            const find = products.find((prod) => prod.name === name);
            if (find) {
                let { quantity } = find;
                const newQty = quantity + 1
                const newProduct = {
                    id_prod,
                    timestamp,
                    name,
                    description,
                    thumbnail,
                    price,
                    quantity: newQty,
                    category,
                    stock
                }
                await this.collection.updateOne({ _id:id }, { $pull: { "products": { name: find.name }}})
                await this.collection.findByIdAndUpdate({ _id:id }, {$push: {"products": newProduct }})
            } else {
                const newProduct = {
                    id_prod,
                    timestamp,
                    name,
                    description,
                    thumbnail,
                    price,
                    quantity,
                    category,
                    stock
                }
                await this.collection.findByIdAndUpdate({ _id:id }, { $push: { "products":newProduct }})
            }
        } catch(e) {
            logger.error(`Error saveproducts ${e}`)
        }
    }

    async deleteProdById(id, id_prod){
        try {
            await this.collection.updateOne({ _id:id }, { $pull:{"products": {_id: id_prod} }})
        } catch(e){
            logger.error(`Error deleteprodbyid: ${e}`)
        }
    }

    async getUserCart(id) {
        try {
            const cart = await this.collection.findOne({ $and : [{ id_user: id }, { terminado: false }]});
            return cart;
        } catch (e) {
            logger.error(`Error getusercart: ${e}`)
        }
    }


    async updateCart(id_user) {
        try {
            await this.collection.updateOne({ $and: [{ id_user: id_user}, { terminado:false }]},
            { $set: { terminado: true } })
        } catch (e) {
            logger.error(`Error updatecart:  ${e}`)
        }
    }
}

export default CarritosDaoMongoDB;