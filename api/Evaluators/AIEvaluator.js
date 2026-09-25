const Evaluator = require("./Evaluator");
const { Ollama } = require("ollama");

const {
  SYSTEM_PROMPT,
  evaluationResponseSchema,
} = require("../Utils/AI.Helper.Function");

class AIEvaluator extends Evaluator {
  constructor() {
    super();

    this.ollama = new Ollama({
      host: "http://localhost:11434",
    });
  }

  async evaluate(submission, problem) {
    const response = await this.ollama.chat({
      model: "llama3.1:8b-instruct-q4_K_M",

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `
Evaluate the following LLD submission.

PROBLEM:
${JSON.stringify(
  {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
  },
  null,
  2,
)}

PROBLEM REQUIREMENTS:
${JSON.stringify(problem.requirements, null, 2)}

SUBMISSION:
${JSON.stringify(submission.submittedContent, null, 2)}

Evaluate the submission using the rubric defined in the system prompt.

Return only the required JSON structure.
          `,
        },
      ],

      options: {
        temperature: 0,
      },

      format: evaluationResponseSchema,
    });

    return JSON.parse(response.message.content);
  }
}

module.exports = AIEvaluator;
