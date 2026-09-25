const { Problems: ProblemModel } = require("../Models/Problem.Model");
const Problem = require("../Domain/Problem");

class ProblemRepository {
  async findById(id) {
    const document = await ProblemModel.findById(id);

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async findAll() {
    const documents = await ProblemModel.find();

    return documents.map((document) => this.toDomain(document));
  }

  async create(problem) {
    const document = await ProblemModel.create({
      title: problem.title,
      description: problem.description,
      requirements: problem.requirements,
      difficulty: problem.difficulty,
    });

    return this.toDomain(document);
  }

  toDomain(document) {
    return new Problem({
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      requirements: document.requirements,
      difficulty: document.difficulty,
    });
  }
}

module.exports = ProblemRepository;
