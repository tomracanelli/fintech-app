const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ChargeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    duration: {
      type: String,
      maxlength: 2000,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charge", ChargeSchema);
