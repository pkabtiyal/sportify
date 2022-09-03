//Author: Samarth Jariwala (B008899380)
//Email: sm228153@dal.ca
const express = require("express");
const Facilities = require("../models/facilities");
const Blogs = require("../models/Blogging/allBlogs");
const Merchandise = require("../models/merchandise");
const router = express.Router();

/**
 * This API gets all the facilities available for reservation.
 */
router.get("/facility", async (req, res) => {
  try {
    const allFacilities = await Facilities.find();
    return res.status(200).json({
      data: allFacilities,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

/**
 * This API gets all the Blogs
 */
router.get("/blogs", async (req, res) => {
  try {
    const allBlogs = await Blogs.find();
    return res.status(200).json({
      data: allBlogs,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

/**
 * This API gets all the merchandise products
 */
router.get("/merchandise", async (req, res) => {
  try {
    const allStore = await Merchandise.find();
    return res.status(200).json({
      data: allStore,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});
module.exports = router;
