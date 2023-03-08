import { Server as HttpServer } from "http";
import { DBConnect } from "./config/config.js";
import { Server as Socket } from "socket.io";
import socketHTML from "../public/socket/socket.js";
import ParseArgs from "minimist";
import cluster from "cluster";
import { cpus } from "os";
import app from "./app.js";

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);


io.on("connection", async (socket) => {
    socketHTML(socket, io.sockets);
});


const options = {
    alias: {
        m: "MODO",
    },
    default: {
        MODO: "FORK",
    }
}

const argv = process.argv.slice(2);
const { MODO } = ParseArgs(argv, options)
const PORT = process.env.PORT || 8080;

const cpu = cpus().length;

if (MODO == "CLUSTER") {
    if (cluster.isPrimary) {
        console.log(`Primary: ${process.pid}`);

        for (let i = 1; i <= cpu; i++){
        cluster.fork();
        }

        cluster.on("exit", (worker) => {
        console.log(`Worker PID ${worker.process.pid} caido`);
        cluster.fork();
        })
    } else {
        DBConnect (()=> {
        const connectedServer = httpServer.listen(PORT, () => {
            console.log(
            `Servidor on: ${PORT}`
            );
        });
        connectedServer.on("error", (error) =>
        console.log(`Error en servidor ${error}`)
        );
        })
    }
    } else {
    DBConnect (()=> {
        const connectedServer = httpServer.listen(PORT, () => {
            console.log(
            `Server on: ${PORT}`
        );
        });
        connectedServer.on("error", (error) =>
        console.log(`Error en servidor ${error}`)
        );
    })
}