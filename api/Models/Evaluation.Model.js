const { Schema, model } = require("mongoose");

const evaluationSchema = new Schema(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "submission",
      required: true,
      index: true,
    },
    evaluationType: {
      type: String,
      enum: ["AI", "Human"],
      default: "AI",
      required: true,
    },
    status: {
      type: String,
      enum: ["Evaluating", "Completed", "Failed"],
      default: "Evaluating",
      index: true,
    },
  },
  { timestamps: true },
);

const Evaluation = model("evaluation", evaluationSchema);
module.exports = { Evaluation };
