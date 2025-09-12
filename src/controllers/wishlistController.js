import Wishlist from "../models/wishlistModel";

export const addToWishlist = async (req, res) => {
  try {
    const { playzone_id } = req.body;

    if (!playzone_id)
      return req
        .status(400)
        .json({ status: 400, message: "Playzone id is required" });

    let existingPlayzone = await Wishlist.findOne({ _id: playzone_id });
    if (existingPlayzone)
      return res
        .status(400)
        .json({ status: 400, message: "Playzone already exsited in Wishlist" });

    existingPlayzone = await Wishlist.create({ playzone: playzone_id });
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, message: `Some Error Occured : ${e.message}` });
  }
};
