const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const clubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            
        },
        description: {
            type: String,
            maxlength: 2000
        },
      
    },
    { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
