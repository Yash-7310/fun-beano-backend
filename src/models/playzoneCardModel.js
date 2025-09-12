import mongoose from "mongoose";

const playzoneSchema = new mongoose.Schema(
  {
    owner_id: {
      type: String,
      // required: true,
    },
    image_preview: {
      type: String,
      // required: true,
    },
    images_id: {
      type: [String],
      // required: true,
    },
    location: {
      // i am giving it a object as i know my location is always going to be same
      type: mongoose.Schema.Types.ObjectId,
      ref: "playzone_locations", //reference of the model name playzone_location, also the name of my collection is exactly same as model name.
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    recommended_age: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    price_type: {
      type: String,
      enum: ["per hour", "per child", "per session", "full day"],
      default: "per hour",
      required: true,
    },
    features: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "playzone_features", // give the model name
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    reviews_id: {
      type: [String],
      // required: true,
    },
  },
  { timestamps: true }
);

const PlayzoneCard = mongoose.model("playzones", playzoneSchema);

export default PlayzoneCard;
