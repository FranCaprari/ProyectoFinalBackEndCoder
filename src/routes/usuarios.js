import { Router } from "express";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcrypt";
import path from "path";
import authMW from "../middlewares/middlewares.js";
import { transporter } from "../mensajeria/nodemailer.js";
import Users from "../daos/usuarios/users.js";

const usuariosRouter = new Router();


passport.use("signup", new localStrategy({
    passReqToCallback: true
}, (req, username, password, done) =>{
    const { name, phone, avatar } = req.body;
    Users.findOne ({ username }, (err, user)=> {
        if (user) return done(null, false);

    Users.create({ username, password: hashPassword (password), name, phone, avatar}, (err, user) => {
            if (err) return done(err);

            const registroMail = async () => {
                await transporter.sendMail({
                    from: "Ecomerce",
                    to: process.env.MAIL_MAIN,
                    subject: "Nuevo usuario registrado!",
                    html: `Nuevo usuario registrado: ${username}`
                });
            };
            //registroMail();

            return done(null, user);
        })
    })
}))


passport.use("login", new localStrategy({}, ( username, password, done) =>{
    Users.findOne({ username }, (err, user)=>{
        if (err) return done(err);
        if (!user) return done(null, false);
        if(!validatePass(password, user.password)) return done(null,false);
        return done(null, user);
    })
}))


const hashPassword = (pass) =>{
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};

const validatePass = (pass, hashedPass) => {
    return bcrypt.compareSync(pass,hashedPass);
};


passport.serializeUser((user, done) => {
    done (null, user._id)
})

passport.deserializeUser((id, done)=>{
    Users.findById(id, done);
})


usuariosRouter.get("/", (req, res) => {
    if (req.isAuthenticated()){
        res.redirect("/productos");
    } else {
        res.redirect("/login");
    }
});

usuariosRouter.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/productos");
    } else {
        res.render(path.join(process.cwd(), "/public/views/login.ejs"));
    };
});

usuariosRouter.get("/signup", (req,res) => {
    res.render(path.join(process.cwd(), "/public/views/signup.ejs"), {
        okRegister: "",
    });
})

usuariosRouter.post("/signup", passport.authenticate("signup", {failureRedirect:"/errorSignUp"}), (req, res, next) => {
    res.render(path.join(process.cwd(), "/public/views/signup.ejs"), {
        okRegister: "Registro exitoso!",
    });
});

usuariosRouter.post("/login", passport.authenticate("login", {failureRedirect:"/errorLogin"}), (req, res) => {
    res.redirect("/");
});

usuariosRouter.get("/logout", (req, res) =>{
    const name = req.user.name;
    req.logout((err) =>{
        if (err) {
            return next (err);
        }
        res.render(path.join(process.cwd(), "/public/views/logout.ejs"), { name: name });
    });
})

usuariosRouter.get("/errorLogin", (req, res) => {
    res.render(path.join(process.cwd(), "/public/views/errorLogin.ejs"));
})

usuariosRouter.get("/errorSignUp", (req, res) => {
    res.render(path.join(process.cwd(), "/public/views/errorSignUp.ejs"));
})


usuariosRouter.get("/idUsuario", (req, res) => {
    const idUsuario = req.user._id;
    res.send(idUsuario);
})

usuariosRouter.get("/perfil", authMW, (req, res)=> {
    const name = req.user.name;
    const username = req.user.username;
    const avatar = req.user.avatar;
    const phone = req.user.phone;
    res.render(path.join(process.cwd(), "/public/views/miPerfil.ejs"), { name: name, email: username,avatar: avatar, phone: phone});
});

usuariosRouter.get("/carrito", authMW, (req, res)=> {
    res.render(path.join(process.cwd(), "/public/views/carrito.ejs"));
});

usuariosRouter.get("/productos", authMW, (req, res)=> {
    const name = req.user.name;
    res.render(path.join(process.cwd(), "/public/views/productos.ejs"), { name: name });
});


usuariosRouter.all("*", (req, res, next) => {
    res.render(path.join(process.cwd(), "/public/views/noExiste.ejs"));
    next();
});

export default usuariosRouter;