import mongoose from "mongoose";

const playzoneLocationSchema = new mongoose.Schema({
  address: {
    type: String,
    // required: true,
    trim: true,
  },
  city: {
    type: String,
    // required: true,
    trim: true,
  },
  state: {
    type: String,
    // required: true,
    trim: true,
  },
  pincode: {
    type: Number,
    // required: true,
    trim: true,
  },
  lat: {
    type: Number,
    // required: true,
    trim: true,
  },
  long: {
    type: Number,
    // required: true,
    trim: true,
  },
});

const PlayzoneLocation = mongoose.model(
  "playzone_locations",
  playzoneLocationSchema
);

export default PlayzoneLocation;
