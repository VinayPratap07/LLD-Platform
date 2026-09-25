class Submission {
  constructor({
    id = null,
    userId,
    problemId,
    submittedContent,
    contentType,
    language = null,
  }) {
    this.id = id;
    this.userId = userId;
    this.problemId = problemId;
    this.submittedContent = submittedContent;
    this.contentType = contentType;
    this.language = language;
  }

  validate() {
    if (!this.submittedContent?.trim()) {
      throw new Error("Submission content is required.");
    }

    if (!this.userId) {
      throw new Error("User is required.");
    }

    if (!this.problemId) {
      throw new Error("Problem is required.");
    }

    if (!["TEXT", "CODE", "DIAGRAM"].includes(this.contentType)) {
      throw new Error("Content type must be TEXT, CODE, or DIAGRAM.");
    }

    if (this.contentType === "CODE" && !this.language) {
      throw new Error("Language is required for code submissions.");
    }
  }

  isCodeSubmission() {
    return this.contentType === "CODE";
  }

  isTextSubmission() {
    return this.contentType === "TEXT";
  }

  isDiagramSubmission() {
    return this.contentType === "DIAGRAM";
  }
}

module.exports = Submission;
