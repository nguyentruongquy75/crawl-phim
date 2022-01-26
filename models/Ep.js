const mongoose = require("mongoose");

const epSchema = new mongoose.Schema({
  epName: String,
  video: String,
});

module.exports = mongoose.model("Ep", epSchema);
