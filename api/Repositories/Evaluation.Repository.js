const { Evaluation: EvaluationModel } = require("../Models/Evaluation.Model");
const Evaluation = require("../Domain/Evaluation");

class EvaluationRepository {
  async create(evaluation) {
    const document = await EvaluationModel.create({
      submissionId: evaluation.submissionId,
      evaluationType: evaluation.evaluationType,
      status: evaluation.status,
      errorReason: evaluation.errorReason,
    });

    return this.toDomain(document);
  }

  async findById(id) {
    const document = await EvaluationModel.findById(id);

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async update(evaluation) {
    const document = await EvaluationModel.findByIdAndUpdate(
      evaluation.id,
      {
        status: evaluation.status,
        errorReason: evaluation.errorReason,
      },
      { new: true },
    );

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  toDomain(document) {
    return new Evaluation({
      id: document._id.toString(),
      submissionId: document.submissionId.toString(),
      evaluationType: document.evaluationType,
      status: document.status,
      errorReason: document.errorReason,
    });
  }
}

module.exports = EvaluationRepository;
