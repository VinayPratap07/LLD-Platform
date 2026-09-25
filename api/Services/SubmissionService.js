const Submission = require("../Domain/Submission");
const Evaluation = require("../Domain/Evaluation");

const SubmissionRepository = require("../Repositories/Submission.Repository");
const EvaluationRepository = require("../Repositories/Evaluation.Repository");

class SubmissionService {
  constructor({
    submissionRepository = new SubmissionRepository(),
    evaluationRepository = new EvaluationRepository(),
    evaluationService,
  }) {
    this.submissionRepository = submissionRepository;
    this.evaluationRepository = evaluationRepository;
    this.evaluationService = evaluationService;
  }

  async createSubmission({
    userId,
    problemId,
    content,
    contentType,
    language,
  }) {
    // Create domain object
    const submission = new Submission({
      userId,
      problemId,
      submittedContent: content,
      contentType,
      language: contentType === "CODE" ? language : null,
    });

    // Domain validation
    submission.validate();

    // Save submission
    const savedSubmission = await this.submissionRepository.create(submission);

    // Create evaluation
    const evaluation = new Evaluation({
      submissionId: savedSubmission.id,
    });

    const savedEvaluation = await this.evaluationRepository.create(evaluation);

    // Start evaluation asynchronously
    this.evaluationService.evaluate(savedEvaluation.id);

    return {
      submission: savedSubmission,
      evaluation: savedEvaluation,
    };
  }
}

module.exports = SubmissionService;
