const { Submission: SubmissionModel } = require("../Models/Submission.Model");
const Submission = require("../Domain/Submission");

class SubmissionRepository {
  async create(submission) {
    const document = await SubmissionModel.create({
      userId: submission.userId,
      problemId: submission.problemId,
      submittedContent: submission.submittedContent,
      contentType: submission.contentType,
      language: submission.language,
    });

    return this.toDomain(document);
  }

  async findById(id) {
    const document = await SubmissionModel.findById(id);

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async findByUserId(userId) {
    const documents = await SubmissionModel.find({ userId });

    return documents.map((document) => this.toDomain(document));
  }

  toDomain(document) {
    return new Submission({
      id: document._id.toString(),
      userId: document.userId.toString(),
      problemId: document.problemId.toString(),
      submittedContent: document.submittedContent,
      contentType: document.contentType,
      language: document.language,
    });
  }
}

module.exports = SubmissionRepository;
