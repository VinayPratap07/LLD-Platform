const SubmissionService = require("../Services/SubmissionService");
const evaluationService = require("../Services/EvalutionService");
const { Submission } = require("../Models/Submission.Model");
const { Feedback } = require("../Models/Feedback.Model");

const submissionService = new SubmissionService({
  evaluationService,
});

async function handleSubmission(req, res) {
  const { content, problemId, language, contentType } = req.body;

  console.log(content);

  if (!content || !problemId || !contentType) {
    return res.status(422).json({
      message: "content, problemId, and contentType are required.",
    });
  }

  if (!["TEXT", "CODE"].includes(contentType)) {
    return res.status(422).json({
      message: "contentType must be either TEXT or CODE.",
    });
  }

  if (contentType === "CODE" && !language) {
    return res.status(422).json({
      message: "language is required for code submissions.",
    });
  }

  try {
    const result = await submissionService.createSubmission({
      userId: req.user.id,
      problemId,
      content,
      contentType,
      language,
    });

    return res.status(200).json({
      evaluationId: result.evaluation.id,
      submissionId: result.submission.id,
    });
  } catch (error) {
    console.error("Submission creation failed:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

async function getUserSubmissions(req, res) {
  const id = req.user.id;

  try {
    const submissions = await Submission.find({
      userId: id,
    })
      .populate({
        path: "problemId",
        select: "title difficulty",
      })
      .populate("evaluation");

    if (!submissions) {
      return res.status(404).status({ message: "No submissions found" });
    }

    return res.status(200).json({ submissions: submissions });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

async function getEvaluationById(req, res) {
  const evalId = req.params.id;
  console.log(evalId);

  try {
    const evaluation = await Feedback.find({ evaluationId: evalId });

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    return res.status(200).json({ evaluation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { handleSubmission, getUserSubmissions, getEvaluationById };
