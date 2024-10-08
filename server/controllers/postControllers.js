const Post = require("../models/postModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel"); 
const path = require('path');
const { v4: uuid } = require('uuid');
const HttpError = require("../models/errorModel");
const fs = require('fs');
const { title } = require("process");
const { uploadOnCloudinary } = require('../utils/cloudinary')
const { v2: cloudinary } = require("cloudinary");


// ==========================CREATE A Post
// Post :api/posts
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.file) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422));
        }

        const thumbnailLocalPath = req.file?.path;
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
        const post = await Post.findById(postID)
            .populate({
                path: 'reviews',
                populate: { path: 'author', select: 'name _id' }  // Populate the author's name (or any other fields you need)
            });

        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};


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


const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        if (!title || !category || !description || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        let updateData = { title, category, description };

        // If a new thumbnail is provided
        if (req.file) {
            // Get the old post
            const oldPost = await Post.findById(postId);
            if (!oldPost) {
                return next(new HttpError("Post not found.", 404));
            }

            // Remove the old thumbnail from Cloudinary
            if (oldPost.thumbnail) {
                const publicId = oldPost.thumbnail.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId, (error) => {
                    if (error) {
                        return next(new HttpError("Failed to delete old thumbnail from Cloudinary.", 500));
                    }
                });
            }

            // Upload the new thumbnail to Cloudinary
            const thumbnailLocalPath = req.file.path;
            const cloudinaryResult = await uploadOnCloudinary(thumbnailLocalPath);
            if (!cloudinaryResult) {
                return next(new HttpError("Thumbnail upload failed", 422));
            }

            updateData.thumbnail = cloudinaryResult.secure_url || cloudinaryResult.url;
        }

        // Update the post with the new data
        const updatePost = await Post.findByIdAndUpdate(postId, updateData, { new: true });

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
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        // Extract the public ID from the thumbnail URL
        const thumbnailUrl = post.thumbnail;
        const publicId = thumbnailUrl.split('/').pop().split('.')[0]; // Extract public ID from the URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return next(new HttpError("Failed to delete image from Cloudinary.", 500));
            }
        });

        // Delete all reviews associated with this post
        console.log("deleting the comment")
        await Review.deleteMany({ _id: { $in: post.reviews } });
        console.log("deleted the the comment")


        // Delete the post from the database
        await Post.findByIdAndDelete(postId);

        // Reduce the post count of the user
        const currentUser = await User.findById(req.user.id);
        if (currentUser) {
            const userPostCount = currentUser.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        }

        // Send response after everything is done
        res.json({ message: `Post ${postId} and associated reviews deleted successfully.` });

    } catch (error) {
        return next(new HttpError("An error occurred while deleting the post.", 500));
    }
};



module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };

