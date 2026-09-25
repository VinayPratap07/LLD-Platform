class Evaluator {
  async evaluate(submission, problem) {
    throw new Error("evaluate() must be implemented by a concrete evaluator.");
  }
}

module.exports = Evaluator;
