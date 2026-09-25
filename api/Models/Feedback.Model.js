const { Schema, model } = require("mongoose");

const feedbackDetailSchema = new Schema(
  {
    criterion: {
      type: String,
      required: true,
      enum: [
        "Requirement Understanding",
        "Class Responsibilities",
        "Coupling & Cohesion",
        "Encapsulation & Interfaces",
        "Abstraction & Design Patterns",
        "Extensibility",
        "Edge Cases & Testability",
        "Quality of Explanation",
      ],
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    evidence: {
      type: String,
      required: true,
      trim: true,
    },

    concern: {
      type: String,
      required: true,
      trim: true,
    },

    suggestion: {
      type: String,
      required: true,
      trim: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  { _id: false },
);

const feedbackSchema = new Schema(
  {
    evaluationId: {
      type: Schema.Types.ObjectId,
      ref: "evaluation",
      required: true,
      unique: true,
    },

    feedbackDetails: {
      type: [feedbackDetailSchema],
      required: true,
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
      trim: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Feedback = model("feedback", feedbackSchema);

module.exports = { Feedback };
