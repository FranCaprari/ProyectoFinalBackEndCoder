import { Router } from "express";
import { CarritosDao, OrdenesDao } from "../daos/DAOFactory.js";
import { transporter } from "../mensajeria/nodemailer.js";

const ordenesRouter = Router();

let orders = OrdenesDao;

ordenesRouter.get("/", async (req, res) => {
    try {
        const ordenes = await orders.getAll();
        res.send(ordenes);
    } catch (e) {
        res.send({ error: true })
    }
})

ordenesRouter.post("/:id", async (req, res)=> {
    const { id } = req.params;
    try {
        const timestamp = new Date();
        const id_user = req.user._id;
        const user = req.user.username;

        let found = await CarritosDao.getById(id);
        const { products } = found

        const total = products.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0)

        const ordenes = await orders.getAll()
        const number = ordenes.length + 1
        
        const orderId = await orders.save({ timestamp, products, id_user, number, total });

        const ordenMail = async () => {
            await transporter.sendMail({
                from: "Ecomerce",
                to: `${user}`,
                subject: "Compra realizada",
                html: `Compra realizada: ${products}`
            });
        };
        //ordenMail();

        res.send(orderId)
    } catch (e) {
        res.status(404).json({ error: `Error en post ordenesrouter ${e}` })
    }
});


export default ordenesRouter;