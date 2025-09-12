import Users from "../models/userModels.js";
import PlayzoneCard from "../models/playzoneCardModel.js";
import PlayzoneFeatures from "../models/playzoneFeaturesModel.js";
import PlayzoneLocation from "../models/playzoneLocationModal.js";

// get all playzones
export const getAllPlayzones = async (req, res) => {
  try {
    const playzones = await PlayzoneCard.find()
      .populate("features", "name")
      .populate("location", "city address state pincode lat long");

    if (!playzones) {
      return res
        .status(404)
        .json({ status: 404, message: "Playzone not found" });
    }

    res.status(200).json({
      status: 200,
      data: playzones,
      message: "Playzone fetched successfully.",
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `Some Error Occured : ${e.message}` });
  }
};

export const addPlayzone = async (req, res) => {
  try {
    const {
      owner_id,
      image_preview,
      images_id,
      name,
      recommended_age,
      price,
      price_type,
      features,
      verified,
      reviews_id,
      location,
    } = req.body;

    if (
      owner_id === undefined ||
      image_preview === undefined ||
      images_id === undefined ||
      name === undefined ||
      recommended_age === undefined ||
      price === undefined ||
      price_type === undefined ||
      features === undefined ||
      verified === undefined ||
      reviews_id === undefined ||
      location === undefined
    )
      return res
        .status(400)
        .json({ status: 400, message: "all the fields are required" });

    let existingPlayzone = await PlayzoneCard.find({ name });
    if (existingPlayzone.length > 0)
      return res.status(400).json({
        status: 400,
        message: "Playzone name is already taken, Give different name",
      });

    existingPlayzone = await PlayzoneCard.create({
      owner_id,
      image_preview,
      images_id,
      name,
      recommended_age,
      price,
      price_type,
      features,
      verified,
      reviews_id,
      location,
    });

    existingPlayzone.save();

    res
      .status(200)
      .json({ status: 200, message: "Playzone added successfully" });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `Some Error Occured : ${e.message}` });
  }
};

// get all the playzone cards by owners id
export const getAllPlayzonesByOwnerId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ status: 400, message: "ownder id is required" });

    const found_user = await Users.findOne({ _id: id });

    if (!found_user) {
      // console.log("User not found.");
      return res
        .status(400)
        .json({ status: 400, message: "user not found with the entered id" });
    }

    const playzones = await PlayzoneCard.find({ owner_id: id })
      .populate("features", "name")
      .populate("location", "city address state pincode lat long");

    if (playzones.length <= 0) {
      return res
        .status(404)
        .json({ status: 404, message: "playzone not found" });
    }
    // console.log(playzones);

    if (!playzones)
      return res
        .status(400)
        .json({ status: 400, message: "no playzones found" });

    res.status(200).json({
      status: 200,
      data: playzones,
      message: "Playzone fetched successfully.",
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `some error occured due to ${e.message}` });
  }
};

// get all playzone features
export const getAllPlayzoneFeatures = async (req, res) => {
  try {
    console.log("inside get all features");
    // fetch all the playzones

    const pz_features = await PlayzoneFeatures.find();
    if (!pz_features)
      return res
        .status(400)
        .json({ status: 400, message: "no playzones found" });

    res.status(200).json({
      status: 200,
      data: pz_features,
      message: "Data fetched successfully.",
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `some error occured due to ${e.message}` });
  }
};

// add a new feature
export const addPlayzoneFeatures = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ status: 400, message: "name is required" });
  }

  let existingFeature = await PlayzoneFeatures.findOne({ name });

  if (existingFeature)
    return res
      .status(400)
      .json({ status: 400, message: "Feature already exists" });

  existingFeature = await PlayzoneFeatures.create({ name });

  await existingFeature.save();
  res.status(200).json({ status: 200, message: "Feature added" });
};

// get all playzone location
export const getAllPlayzoneLocation = async (req, res) => {
  try {
    console.log("inside get all location");
    console.log(PlayzoneLocation.db.name);
    console.log(PlayzoneLocation.collection.name);
    // fetch all the playzones

    const pz_location = await PlayzoneLocation.find();
    if (!pz_location)
      return res
        .status(400)
        .json({ status: 400, message: "no playzones found" });

    res.status(200).json({
      status: 200,
      data: pz_location,
      message: "Data fetched successfully.",
    });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `some error occured due to ${e.message}` });
  }
};

export const addPlayzoneLocation = async (req, res) => {
  try {
    // fetch all the body values,
    const { city, state, address, pincode, lat, long } = req.body;

    if (!city || !state || !address || !pincode || !lat || !long)
      return res.status(400).json({
        status: 400,
        message:
          "All the information is required, there is something you have not filled",
      });

    let location = await PlayzoneLocation.create({
      city,
      state,
      address,
      pincode,
      lat,
      long,
    });

    if (!location)
      return res
        .status(400)
        .json({ status: 400, message: "Unable to Add Location" });

    return res.status(200).json({ status: 200, message: "Location added" });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `Some Error Occured : ${e.message}` });
  }
};
