const { Ollama } = require("ollama");

const {
  SYSTEM_PROMPT,
  evaluationResponseSchema,
} = require("../Utils/AI.Helper.Function");

const ollama = new Ollama({
  host: "http://localhost:11434",
});

async function evaluateWithAI(userResponse, problemDescription, requirements) {
  console.log("Evaluation started");
  const response = await ollama.chat({
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
${JSON.stringify(problemDescription, null, 2)}

PROBLEM REQUIREMENTS:
${JSON.stringify(requirements, null, 2)}

SUBMISSION:
${JSON.stringify(userResponse, null, 2)}

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

  console.log("Evaluation end");

  return JSON.parse(response.message.content);
}

module.exports = {
  evaluateWithAI,
};
