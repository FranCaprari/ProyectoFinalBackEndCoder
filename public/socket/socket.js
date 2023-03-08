import { ChatsDao} from "../../src/daos/DAOFactory.js";

let messages = await ChatsDao.getAll();

const socketHTML = (socket, sockets) => {

    socket.emit("mensajes", messages);


    socket.on("newMensaje", async (data) =>{
    const date = new Date().toLocaleString();
    await ChatsDao.save({
        timestamp: date,
        message: data.message,
        id_user: data.id_user,
        }
    );

    messages = await ChatsDao.getAll();


    sockets.emit("mensajes", messages);
    })
}

export default socketHTML;