const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require('path');
const { v4: uuid } = require('uuid');
const HttpError = require("../models/errorModel");
const fs = require('fs');
const { title } = require("process");
const { uploadOnCloudinary } = require('../utils/cloudinary')

// ==========================CREATE A Post
// Post :api/posts
const createPost = async (req, res, next) => {
    console.log("heloo")
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.file) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422));
        }

        const thumbnailLocalPath = req.file.path;
        if (!thumbnailLocalPath) {
            return next(new HttpError("Thumbnail is required", 422));
        }

        const cloudinaryResult = await uploadOnCloudinary(thumbnailLocalPath);
        if (!cloudinaryResult) {
            return next(new HttpError("Thumbnail upload failed", 422));
        }

        // Save only the URL or secure URL to the thumbnail field
        const thumbnail = cloudinaryResult.secure_url || cloudinaryResult.url;

        const newPost = await Post.create({ title, category, description, thumbnail, creator: req.user.id });
        if (!newPost) {
            return next(new HttpError("Post couldn't be created.", 422));
        }

        const currentUser = await User.findById(req.user.id);
        const userPostcount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostcount });

        res.status(201).json(newPost);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};





// ==========================Get All  Posts
// Get :api/posts
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 })
        res.status(200).json(posts)

    } catch (error) {
        return next(new HttpError(error))
    }
}

// ==========================Get Single  Post
// Get :api/posts/:id
const getPost = async (req, res, next) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        if (!post) {
            return next(new HttpError("Post not found.", 404))
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ==========================Get Posts by category
// get :api/posts/:id
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 })
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ==========================Get User Posts
// get :api/posts/users/:id
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ==========================Edit posts
// Patch :api/posts/users/:id
const editPost = async (req, res, next) => {
    try {
        let updatePost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        if (!req.files) {
            // Update post without changing the thumbnail
            updatePost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            // Get old post from the database
            const oldPost = await Post.findById(postId);
            if (oldPost.thumbnail) {
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });
            }

            // Upload new thumbnail
            const { thumbnail } = req.files;
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big. Should be less than 2MB.", 422));
            }

            const fileName = thumbnail.name;
            const splittedFilename = fileName.split('.');
            const newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1];

            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if (err) {
                    return next(new HttpError("Thumbnail upload failed.", 500));
                }
            });

            updatePost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true });
        }

        if (!updatePost) {
            return next(new HttpError("Couldn't update post.", 400));
        }

        res.status(200).json(updatePost);
    } catch (error) {
        return next(new HttpError("An error occurred while updating the post.", 500));
    }
};

// ==========================Delete Posts
// delete :api/posts/users/:id
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id; // Correctly accessing postId from params
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        const fileName = post.thumbnail;

        // Delete thumbnail from uploads folder if exists
        if (fileName) {
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError("Error deleting file from server.", 500));
                }

                // Delete the post from the database
                await Post.findByIdAndDelete(postId);

                // Reduce the post count of the user
                const currentUser = await User.findById(req.user.id);
                if (currentUser) {
                    const userPostCount = currentUser.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                }

                // Send response after everything is done
                res.json({ message: `Post ${postId} deleted successfully.` });
            });
        } else {
            // If no thumbnail, just delete the post and update user post count
            await Post.findByIdAndDelete(postId);
            const currentUser = await User.findById(req.user.id);
            if (currentUser) {
                const userPostCount = currentUser.posts - 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            }
            res.json({ message: `Post ${postId} deleted successfully.` });
        }
    } catch (error) {
        return next(new HttpError("An error occurred while deleting the post.", 500));
    }
};

module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };