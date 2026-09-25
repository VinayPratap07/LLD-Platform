const EvaluationRepository = require("../Repositories/Evaluation.Repository");
const SubmissionRepository = require("../Repositories/Submission.Repository");
const ProblemRepository = require("../Repositories/Problem.Repository");
const FeedbackRepository = require("../Repositories/Feedback.Repository");

class EvaluationService {
  constructor({
    evaluationRepository = new EvaluationRepository(),
    submissionRepository = new SubmissionRepository(),
    problemRepository = new ProblemRepository(),
    feedbackRepository = new FeedbackRepository(),
    evaluator,
  }) {
    this.evaluationRepository = evaluationRepository;
    this.submissionRepository = submissionRepository;
    this.problemRepository = problemRepository;
    this.feedbackRepository = feedbackRepository;
    this.evaluator = evaluator;
  }

  async evaluate(evaluationId) {
    let evaluation;

    try {
      // 1. Get evaluation
      evaluation = await this.evaluationRepository.findById(evaluationId);

      if (!evaluation) {
        throw new Error("Evaluation record not found.");
      }

      // 2. Get submission
      const submission = await this.submissionRepository.findById(
        evaluation.submissionId,
      );

      if (!submission) {
        throw new Error("Submission record not found.");
      }

      // 3. Get problem
      const problem = await this.problemRepository.findById(
        submission.problemId,
      );

      if (!problem) {
        throw new Error("Problem record not found.");
      }

      // 4. Ask evaluator to evaluate
      const result = await this.evaluator.evaluate(submission, problem);

      // 5. Save feedback
      const feedback = await this.feedbackRepository.create({
        evaluationId: evaluation.id,
        feedbackDetails: result.feedback,
        overallFeedback: result.overallFeedback,
        strengths: result.strengths,
        improvements: result.improvements,
      });

      // 6. Update domain state
      evaluation.complete();

      // 7. Persist updated evaluation
      await this.evaluationRepository.update(evaluation);

      return {
        evaluation,
        feedback,
      };
    } catch (error) {
      console.error(`Evaluation failure on ID ${evaluationId}:`, error);

      if (evaluation) {
        evaluation.fail(error.message);

        await this.evaluationRepository
          .update(evaluation)
          .catch((saveError) => {
            console.error("Failed to persist evaluation failure:", saveError);
          });
      }

      return null;
    }
  }
}

const AIEvaluator = require("../Evaluators/AIEvaluator");

const evaluationService = new EvaluationService({
  evaluator: new AIEvaluator(),
});

module.exports = evaluationService;
