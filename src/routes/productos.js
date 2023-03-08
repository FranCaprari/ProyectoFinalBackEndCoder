import { Router } from "express";
import { ProductosDao } from "../daos/DAOFactory.js";

const productosRouter = Router();

const productos = ProductosDao;

productosRouter.get("/", async (req, res) =>{
    try {
        const products = await productos.getAll();
        res.send(products)
    } catch (e){
        res.status(404).json({ error: `Error en get productosRouter ${e}` })
    }
});


productosRouter.get("/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await productos.getByCategory(category);
        if (products){
            res.send(products);
        } else {
            res.status(404).json({ error: "La categoria no existe." })
        }
    } catch (e) {
        res.status(404).json({ error: `Error en post al filtrar por categoria en productosRouter ${e}` })
    }
})


productosRouter.get("/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        let found = await productos.getById(id);
        if (found){
            res.send(found)
        } else {
            res.status(404).json({ error:"El producto no existe" })
        }
    } catch (e){
        res.status(404).json({ error: `Error en get producto por id productosRouter ${e}` })
    }
})


productosRouter.post("/",  async (req, res) =>{
    const timestamp = new Date();
    try {
        const { name, price, description, thumbnail, stock, category } = req.body;
        const id = await productos.save({ name, price, description, thumbnail, stock, timestamp, category });
        res.send(`producto añadido id: ${id}`)
    } catch (e) {
        res.status(404).json({ error: `Error en post un producto en productosRouter ${e}` })
    }
})


productosRouter.put("/:id", async (req, res) =>{
    const timestamp = new Date();
    try {
        const { id } = req.params;
        const { name, price, description, thumbnail, stock } = req.body;
        const found = await productos.updateById({ id, name, price, description,  thumbnail, stock, timestamp });
        if (found) {
            res.send(`Se actualizo el producto: ${id}`)
        } else {
            res.status(404).json({ error: "El producto no existe" })
        }
    } catch (e){
        res.status(404).json({ error: `Error en put producto, productosRouter ${e}` })
    }
})

productosRouter.delete("/:id",  async (req, res) =>{
    try {
        const { id } = req.params;
        let found = await productos.deleteById(id);
        if (found) {
            res.send(`Se elimino el producto con ID ${id}`)
        } else {
            res.status(404).json({ error: "El producto no existe" })
        }
    } catch (e){
        res.status(404).json({ error: `Error en delete un producto, productosRouter ${e}` })
    }
})

export default productosRouter;