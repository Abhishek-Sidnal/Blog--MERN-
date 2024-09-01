const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const crypto = require('crypto');
const nodemailer = require('nodemailer');


const User = require("../models/userModel");
const HttpError = require("../models/errorModel");


//==================================== Register A new user
// POST : api/users/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters.", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationTokenExpires = Date.now() + 3600000; // 1 hour

        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashPass,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationTokenExpires,
        });

        const verificationUrl = `${process.env.ORIGIN}/verify-email/${verificationToken}`;
        const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: newEmail,
            from: process.env.EMAIL_USER,
            subject: 'Email Verification',
            text: message,
        });

        res.status(201).json(`New user registered. Please check your email to verify your account.`);
    } catch (error) {
        return next(new HttpError("User registration failed.", 500));
    }
};
// GET: api/users/verify-email/:token
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(new HttpError("Verification token is invalid or has expired.", 400));
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email successfully verified." });
    } catch (error) {
        return next(new HttpError("Email verification failed.", 500));
    }
};




//==================================== Login A registered user
// POST : api/users/login
// POST: api/users/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        if (!user.isVerified) {
            return next(new HttpError("Please verify your email before logging in.", 403));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "10D" });

        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 500));
    }
};



//====================================  User profile
// GET : api/users/:id
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError("User not Found", 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//==================================== Change user avatar
// PUT : api/users/change-avatar
const { uploadOnCloudinary } = require('../utils/cloudinary');

const changeAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new HttpError("Avatar file is required.", 422));
        }

        // Upload the avatar to Cloudinary
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResult) {
            return next(new HttpError("Avatar upload failed.", 500));
        }

        // Update user's avatar URL
        const avatarUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        );

        if (!updatedUser) {
            return next(new HttpError("Failed to update avatar.", 500));
        }

        res.status(200).json({ avatar: updatedUser.avatar });
    } catch (error) {
        return next(new HttpError("An error occurred while updating the avatar.", 500));
    }
};
//==================================== Edit user details (from profile)
// PUT : api/users/edit-user
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, newConfirmPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("Fill in all fields", 422))
        }

        // get user from db
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 403))
        }

        // make sure new email does.t already exist
        const emailExist = await User.findOne({ email });
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exist.", 422))
        }

        // compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password", 422))
        }

        // Compare new passwords
        if (newPassword != newConfirmPassword) {
            return next(new HttpError("New password do not match", 422))
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(newPassword, salt);

        // Update user info in db
        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: Hash }, { new: true })

        res.status(200).json(newInfo);

    } catch (error) {
        return next(new HttpError(error));
    }
};

//==================================== Get all Authors
// GET : api/users/authors
const getAuthors = async (req, res, next) => {
    try {
        // Query to find only verified users and exclude the password field
        const authors = await User.find({ isVerified: true }).select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not fetch authors."));
    }
};


// POST: api/users/forgot-password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new HttpError("Please provide an email address.", 422));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new HttpError("No account with that email address exists.", 404));
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash the token and set the expiration time
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send the reset email
        const resetUrl = `${process.env.ORIGIN}/reset-password/${resetToken}`;

        const message = `You are receiving this because you (or someone else) have requested the reset of a password.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }, logger: true, // Enable logging
            debug: true,  // Enable debug mode,
        });

        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: message,
        });

        res.status(200).json({ message: 'Password reset link sent.' });
    } catch (error) {
        return next(new HttpError("Failed to send password reset email.", 500));
    }
};

// PUT: api/users/reset-password/:token
// PUT: api/users/reset-password/:token
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return next(new HttpError("Please provide all fields.", 422));
        }

        if (newPassword !== confirmPassword) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        // Hash the received token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user by the hashed token and check if the token is not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(new HttpError("Password reset token is invalid or has expired.", 400));
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password has been reset." });
    } catch (error) {
        return next(new HttpError("Failed to reset password.", 500));
    }
};



async function sendTestEmail() {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'apsidnal@gmail.com', // Replace with a test recipient email
            subject: 'Test Email',
            text: 'This is a test email to check the email sending functionality.',
        });
        // console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

// sendTestEmail();


module.exports = { registerUser,verifyEmail, loginUser, getUser, getAuthors, editUser, changeAvatar, forgotPassword, resetPassword };





