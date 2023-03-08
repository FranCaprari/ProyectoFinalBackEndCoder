import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js";
import logger from "../../logger/log4JS.js"

class ChatsDaoMongoDB extends ContenedorMongoDB {
    constructor () {
        super ("chats", {
            timestamp: {type: String, required: true},
            id_user: {type: String, required: true},
            type: {type: String, required: true, default: "usuario"},
            message: {type: String, required: true}
        })
    }

    async getByUser(email) {
        try {
            const messages = await this.collection.find({ id_user: email });
            return messages;
        } catch (e) {
            logger.error(`Error ${e}`)
        }
    }
}

export default ChatsDaoMongoDB;