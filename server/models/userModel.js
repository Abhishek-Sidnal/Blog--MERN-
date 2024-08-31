const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://res.cloudinary.com/dt1i09bmw/image/upload/v1723632698/wpdo6b9ya1b86u9hcmpq.png" },
    posts: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isVerified: { type: Boolean, default: false },  // New field to track email verification status
    emailVerificationToken: { type: String },       // New field for email verification token
    emailVerificationExpires: { type: Date }        // New field for token expiration time
});

module.exports = model("User", userSchema);
