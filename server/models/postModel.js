const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: [
            "Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"
        ],
        message: "{VALUE} is not supported"  // Corrected typo
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Ensuring creator is always present
    thumbnail: { type: String, required: true }, // Expecting a string URL here
}, { timestamps: true });

module.exports = model("Post", postSchema);
