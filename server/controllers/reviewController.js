const Post = require("../models/postModel");
const Review = require("../models/reviewModel");
const HttpError = require("../models/errorModel");

// ==========================CREATE A Review
const createReview = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { rating, comment } = req.body;

        if (!comment || comment.trim() === "") {
            return next(new HttpError("Review comment is required.", 422));
        }

        if (!rating || rating < 1 || rating > 5) {
            return next(new HttpError("Rating must be a number between 1 and 5.", 422));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        const newReview = new Review({
            comment,
            rating,
            author: req.user.id // Use req.user.id or req.user._id depending on how your JWT is structured
        });

        await newReview.save();
        post.reviews.push(newReview._id);
        await post.save();

        res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
        return next(new HttpError("An error occurred while creating the review.", 500));
    }
};




// ==========================DELETE A Review
const destroyReview = async (req, res, next) => {
    try {
      const { id: postId, reviewId } = req.params;
  
      const post = await Post.findById(postId);
      if (!post) {
        return next(new HttpError("Post not found.", 404));
      }
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return next(new HttpError("Review not found.", 404));
      }
  
      // Check if the logged-in user is the author of the review
      if (review.author.toString() !== req.user.id) {
        return next(new HttpError("You are not authorized to delete this review.", 403));
      }
  
      // Remove the review reference from the post
      post.reviews = post.reviews.filter((rev) => rev.toString() !== reviewId);
      await post.save();
  
      // Delete the review itself
      await Review.findByIdAndDelete(reviewId);
  
      res.json({ message: "Review deleted successfully." });
    } catch (error) {
      return next(new HttpError("An error occurred while deleting the review.", 500));
    }
  };
  

module.exports = { createReview, destroyReview };


