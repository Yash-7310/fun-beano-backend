import mongoose from "mongoose";

const playzoneFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const PlayzoneFeatures = mongoose.model(
  "playzone_features",
  playzoneFeatureSchema
);

export default PlayzoneFeatures;
