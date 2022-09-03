//Author: Navya Jayapal (B00886554)
//Email: nv408879@dal.ca
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BlogsSchema = new Schema({
  id: String,
  userId: String,
  blogTitle: String,
  shortContent: String,
  blogContent: String,
  blogImage: String,
  timeStamp: String,
});

const Blogs = new model("Blogs", BlogsSchema);
module.exports = Blogs;
