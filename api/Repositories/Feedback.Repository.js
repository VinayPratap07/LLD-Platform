const { Feedback: FeedbackModel } = require("../Models/Feedback.Model");
const Feedback = require("../Domain/Feedback");

class FeedbackRepository {
  async create(feedback) {
    const document = await FeedbackModel.create(feedback);

    return this.toDomain(document);
  }

  async findByEvaluationId(evaluationId) {
    const documents = await FeedbackModel.find({ evaluationId });

    return documents.map((document) => this.toDomain(document));
  }

  toDomain(document) {
    return new Feedback({
      criterion: document.criterion,
      score: document.score,
      evidence: document.evidence,
      concern: document.concern,
      suggestion: document.suggestion,
      confidence: document.confidence,
    });
  }
}

module.exports = FeedbackRepository;
