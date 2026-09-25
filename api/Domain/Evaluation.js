class Evaluation {
  constructor({
    id = null,
    submissionId,
    evaluationType = "AI",
    status = "Evaluating",
  }) {
    this.id = id;
    this.submissionId = submissionId;
    this.evaluationType = evaluationType;
    this.status = status;
  }

  complete() {
    if (this.status !== "Evaluating") {
      throw new Error(`Evaluation cannot complete from ${this.status} state.`);
    }

    this.status = "Completed";
    this.errorReason = null;
  }

  fail(reason) {
    this.status = "Failed";
    this.errorReason = reason || "Evaluation failed.";
  }

  isEvaluating() {
    return this.status === "Evaluating";
  }

  isCompleted() {
    return this.status === "Completed";
  }

  isFailed() {
    return this.status === "Failed";
  }
}

module.exports = Evaluation;
