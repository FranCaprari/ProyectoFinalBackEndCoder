import express from "express";
import session from "express-session";
import path from "path";
import MongoStore from "connect-mongo";
import usuariosRouter from "./routes/usuarios.js";
import passport from "passport";
import * as dotenv from "dotenv";
import productosRouter from "./routes/productos.js"
import carritosRouter from "./routes/carritos.js"
import chatRouter from "./routes/chat.js";
import ordenesRouter from "./routes/ordenes.js";


dotenv.config();

const DATABASE = process.env.DATABASE;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));

app.set("views", "./views");
app.set("view engine", "ejs");


app.use(
    session({
        store: MongoStore.create({
        mongoUrl: `${DATABASE}`,
        }),
        secret: "soysecreto",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());


app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritosRouter);
app.use("/chat", chatRouter);
app.use("/ordenes", ordenesRouter);
app.use(usuariosRouter);

export default app;