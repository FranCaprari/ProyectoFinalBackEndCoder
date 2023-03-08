import { Router } from "express";
import authMW from "../middlewares/middlewares.js";
import { ChatsDao } from "../daos/DAOFactory.js";
import path from "path";

const chatRouter = Router();


chatRouter.get("/", authMW, (req, res) => {
    const email = req.user.username;
    res.render(path.join(process.cwd(), "/public/views/chat.ejs"), { email: email });
});


chatRouter.get("/:email", authMW, async (req, res) => {
    try {
        const { email } = req.params;
        const find = await ChatsDao.getByUser(email);
        res.send(find);
    } catch (e) {
        res.status(404).json({ error: "Error en get chatrouter" })
    }
});


export default chatRouter;