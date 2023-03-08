import path from "path";

const authMW = (req,res, next) =>{
    req.isAuthenticated() ?
    next () 
    : res.render(path.join(process.cwd(), "/public/views/sinLoguear.ejs"))
};
const authAdmin = (req, res, next) => {
    const admin = req.user.admin;
    if(admin){
        next();
    }else{
        const route = req.originalUrl;
        const method = req.method;
        res.send(`Esta ubicacion es solo para administradores`);
    }
}
export default authMW;