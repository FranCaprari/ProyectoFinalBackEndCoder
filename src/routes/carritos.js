import { Router } from "express";
import { CarritosDao } from "../daos/DAOFactory.js";

const carritosRouter = Router();

const carrito = CarritosDao;


carritosRouter.post ("/", async (req,res) =>{
    try {
        const id_user = req.user._id;
        const products = [];
        const timestamp = new Date();
        const id = await carrito.save({ timestamp, products, id_user});
        res.send(id)
    } catch (e){
        res.status(404).json({ error: `Error en post carritosRouter ${e}` })
    }
})

carritosRouter.delete ("/:id", async (req, res) =>{
    try {
        const { id } = req.params;
        let found = await carrito.deleteById(id)
        if (found) {
            res.status(200).json(`El carrito con id ${id} fue eliminado`);
        } else {
            res.status(404)({ error: "El carrito no existe" })
        }
    } catch (e){
        res.status(404).json({ error: `Error al eliminar el carrito ${e}` })
    }
})


carritosRouter.get("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        let found = await carrito.getById(id);
        if (found) {
            const { products } = found;
            res.send(products);
        } else {
            res.status(404).json({ error: "El carrito no existe" });
        }
    } catch (e){
        res.status(404).json({ error: `Error en get productos por id de carrito carritosRouter ${e}` })
    }
});


carritosRouter.post("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_prod,
            timestamp,
            name,
            description,
            thumbnail,
            price,
            quantity,
            category,
            stock,
        } = req.body;
        await carrito.saveProducts(
            id,
            id_prod,
            timestamp,
            name,
            description,
            thumbnail,
            price,
            quantity,
            category,
            stock
        );
        return res.send(`Producto con id ${id_prod} agregado al carrito ${id}`);
    } catch (e) {
        res.status(404).json({ error: `Error en post producto en carrito carritosRouter ${e}` })
    }
});


carritosRouter.delete("/:id/productos/:id_prod", async (req, res) =>{
    try {
        const { id, id_prod } = req.params;
        await carrito.deleteProdById(id, id_prod);
        res.status(200).json(`Producto con id ${id_prod} eliminado del carrito ${id}`);
    } catch (e) {
        res.status(404).json({ error: `Error en delete producto carritosRouter ${e}` })
    }
});


carritosRouter.get("/idCarrito/:id_user", async (req,res) => {
    try {
        const { id_user } = req.params;
        let found = await carrito.getUserCart(id_user);
        if (found) {
            res.send(found);
        } else {
            res.send({ _id: null });
        }
    } catch (e) {
        res.status(404).json({ error: `Error en get carrito por id de usuario carritosRouter ${e}` })
    }
});


carritosRouter.put("/:id_user", async (req, res) => {
    try {
        const { id_user } = req.params;
        await carrito.updateCart(id_user);
        res.status(200).json(`Carrito de usuario id ${id_user} cerrado`)
    } catch (e) {
        res.status(404).json({ error: `Error en put carritosRouter ${e}` })
    }
})


export default carritosRouter;