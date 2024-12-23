const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const transactionSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    transaction_id: String,
    amount: Number,
    paid_for: String,
    mode: String,
    account_number: String,
    destination_number: String,
    message_description: String,
    transaction_number: String,
    bank_name: String,
    destination_account_number: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
