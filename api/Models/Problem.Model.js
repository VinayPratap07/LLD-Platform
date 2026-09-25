const { Schema, model } = require("mongoose");

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: [String],
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
    },
  },
  { timestamps: true },
);

const Problems = model("problem", problemSchema);
module.exports = { Problems };
