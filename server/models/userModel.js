const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://res.cloudinary.com/dt1i09bmw/image/upload/v1723632698/wpdo6b9ya1b86u9hcmpq.png" },
    posts: { type: Number, default: 0 },
})

module.exports = model("User", userSchema);