const { Evaluation } = require("../Models/Evaluation.Model");
const { Feedback } = require("../Models/Feedback.Model");
const { evaluateWithAI } = require("./AIFeedback.Service");

async function evaluateSubmission(evaluationId) {
  let evaluation;

  try {
    // Get Evaluation -> Submission -> Problem
    evaluation = await Evaluation.findById(evaluationId).populate({
      path: "submissionId",
      populate: {
        path: "problemId",
      },
    });

    if (!evaluation) {
      throw new Error("Evaluation record not found.");
    }

    const submission = evaluation.submissionId;

    if (!submission) {
      throw new Error("Submission record missing.");
    }

    const problem = submission.problemId;

    if (!problem) {
      throw new Error("Problem record missing.");
    }

    // Run AI evaluation
    const aiResult = await evaluateWithAI(
      submission.submittedContent,
      {
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
      },
      problem.requirements,
    );

    // Create Feedback as a separate document
    const feedback = await Feedback.create({
      evaluationId: evaluation._id,

      feedbackDetails: aiResult.feedback,

      overallFeedback: aiResult.overallFeedback,

      strengths: aiResult.strengths,

      improvements: aiResult.improvements,
    });

    // Update evaluation status
    evaluation.status = "Completed";

    await evaluation.save();

    return {
      evaluation,
      feedback,
    };
  } catch (error) {
    console.error(`Evaluation failure on ID ${evaluationId}:`, error);

    if (evaluation) {
      evaluation.status = "Failed";
      evaluation.errorReason = error.message;

      await evaluation.save().catch((saveErr) => {
        console.error("Critical: Failed to persist error state:", saveErr);
      });
    }

    return null;
  }
}

module.exports = { evaluateSubmission };
