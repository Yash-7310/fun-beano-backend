import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    playzone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "playzones",
      required: true,
    },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("wishlist", wishlistSchema);

export default Wishlist;
