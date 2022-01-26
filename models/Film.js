const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema({
  image: String,
  name: String,
  shortDesc: String,
  review: String,
  trailer: String,
  category: String,
  ep: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ep",
    },
  ],
});

module.exports = mongoose.model("Film", filmSchema);
