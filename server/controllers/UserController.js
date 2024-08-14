const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


const User = require("../models/userModel");
const HttpError = require("../models/errorModel");


//==================================== Register A new user
// POST : api/users/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        // Check if all fields are filled
        if (!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422)); // Minor typo fixed in the message
        }

        const newEmail = email.toLowerCase(); // Normalize email to lowercase

        // Check if email already exists in the database
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        // Check if the password length is at least 6 characters
        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters.", 422));
        }

        // Check if both password fields match
        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Create and save the new user to the database
        const newUser = await User.create({ name, email: newEmail, password: hashPass });

        // Respond with the newly created user object
        res.status(201).json(`New user ${newUser.email} registered.`);

    } catch (error) {
        // Catch any errors during the process and handle them
        return next(new HttpError("User registration failed.", 500));
    }
};

//==================================== Login A registered user
// POST : api/users/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail })
        if (!user) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError("Invalid credentials.", 422));
        }
        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "10D" })
        res.status(200).json({ token, id, name })
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
const changeAvatar = async (req, res, next) => {
    try {
        // Check if avatar file is provided
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image", 422));
        }

        // Find user from database
        const user = await User.findById(req.user.id);

        // Delete old avatar if it exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError("Failed to delete old avatar.", 500));
                }
            });
        }

        const { avatar } = req.files;

        // Check file size
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500KB", 422));
        }

        // Generate new filename
        let fileName = avatar.name;
        let splittedFilename = fileName.split('.');
        let newFilename = `${splittedFilename[0]}_${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;

        // Move the new avatar to the uploads directory
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError("Failed to upload new avatar.", 500));
            }

            // Update user's avatar in the database
            const updatedAvatar = await User.findByIdAndUpdate(
                req.user.id,
                { avatar: newFilename },
                { new: true }
            );

            if (!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed.", 422));
            }

            // Respond with the updated user object
            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError("An error occurred while changing avatar.", 500));
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
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error));
    }
};

module.exports = { registerUser, loginUser, getUser, getAuthors, editUser, changeAvatar };
