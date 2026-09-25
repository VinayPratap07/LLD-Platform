const { model, Schema } = require("mongoose");

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    submittedContent: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["CODE", "DIAGRAM", "TEXT"],
      required: true,
    },
    language: {
      type: String,
      default: null,
      enum: ["JAVA", "TYPESCRIPT", "CPP", "PYTHON"],
      required: function () {
        return this.contentType === "CODE";
      },
    },
  },
  { timestamps: true },
);

submissionSchema.virtual("evaluation", {
  ref: "evaluation",
  localField: "_id",
  foreignField: "submissionId",
  justOne: true,
});

submissionSchema.set("toObject", { virtuals: true });
submissionSchema.set("toJSON", { virtuals: true });

const Submission = model("submission", submissionSchema);
module.exports = { Submission };
