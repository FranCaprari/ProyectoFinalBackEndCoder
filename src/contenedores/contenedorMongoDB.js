import mongoose from "mongoose";
import logger from "../logger/log4JS.js"

const DATABASE = process.env.DATABASE;

await mongoose.connect(`${DATABASE}`);

class ContenedorMongoDB {
    constructor (collection, schema){
        this.collection = mongoose.model(collection, schema)
    }

    async getAll(){
        try {
            const objetos = await this.collection.find({});
            return objetos;
        } catch (e){
            logger.error(`Error listar todos: ${e}`)
        }
    };

    async getById(id){
        try {
            const find = await this.collection.findOne({_id:id})
            if (find){
                return find;
            } else {
                return "No existe"
            }
        } catch (e){
            logger.error(`Error listar: ${e}`)
        }
    }

    async save(object){
        try {
            await this.collection.create(object)
            const id = await this.collection
                .find({}, ({_id:1}))
                .limit(1)
                .sort({_id: -1})
            return id;
        } catch (e) {
            logger.error(`Error guardar: ${e}`)
        }
    }

    async updateById(elem){
    const {id} = elem;
        try {
            const find = await this.collection.replaceOne({_id:id}, elem)
            return find;
        } catch (e){
            logger.error(`Error actualizar: ${e}`)
        }
    }

    async deleteById(id){
        try {
            const find = await this.collection.find({_id:id})
            if (!find){
                find = null;
            } else {
                await this.collection.deleteOne({_id:id})
            }
            return find;
        } catch (e){
            logger.error(`Error eliminar: ${e}`)
        }
    }
}

export default ContenedorMongoDB;