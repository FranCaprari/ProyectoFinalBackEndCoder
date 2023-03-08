import mongoose from "mongoose";

const Users = mongoose.model("users", {
    name: String,
    phone: String,
    avatar: String,
    username: String,
    password: String,
});

export default Users;