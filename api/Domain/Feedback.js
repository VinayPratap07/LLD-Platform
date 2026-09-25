class Feedback {
  constructor({ criterion, score, evidence, concern, suggestion, confidence }) {
    this.criterion = criterion;
    this.score = score;
    this.evidence = evidence;
    this.concern = concern;
    this.suggestion = suggestion;
    this.confidence = confidence;
  }

  isReliable() {
    return this.confidence >= 0.7;
  }

  hasConcern() {
    return Boolean(this.concern?.trim());
  }

  hasSuggestion() {
    return Boolean(this.suggestion?.trim());
  }
}

module.exports = Feedback;
