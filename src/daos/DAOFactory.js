import * as dotenv from "dotenv";
dotenv.config();
const TIPO = process.env.TIPO;

import ProductosDaoMongoDB from "./productos/ProductosDaoMongoDB.js";
import CarritosDaoMongoDB from "./carritos/CarritosDaoMongoDB.js";
import ChatsDaoMongoDB from "./Chats/ChatsDaoMongoDB.js";
import OrdenesDaoMongoDB from "./ordenes/OrdenesDaoMongoDB.js";

let ProductosDao;
let CarritosDao;
let ChatsDao;
let OrdenesDao;

switch (TIPO) {
    case "mongo":
        ProductosDao = new ProductosDaoMongoDB();
        CarritosDao = new CarritosDaoMongoDB();
        ChatsDao = new ChatsDaoMongoDB();
        OrdenesDao = new OrdenesDaoMongoDB();
    break;
}

export { ProductosDao };
export { CarritosDao };
export { ChatsDao };
export { OrdenesDao };