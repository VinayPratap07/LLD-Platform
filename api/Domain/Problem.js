class Problem {
  constructor({
    id = null,
    title,
    description,
    requirements = [],
    difficulty,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.difficulty = difficulty;
  }

  hasRequirement(requirement) {
    return this.requirements.includes(requirement);
  }

  addRequirement(requirement) {
    if (!requirement?.trim()) {
      throw new Error("Requirement cannot be empty.");
    }

    this.requirements.push(requirement);
  }

  isEasy() {
    return this.difficulty === "EASY";
  }

  isMedium() {
    return this.difficulty === "MEDIUM";
  }

  isHard() {
    return this.difficulty === "HARD";
  }
}

module.exports = Problem;
