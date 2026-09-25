const { Router } = require("express");
const {
  handleSubmission,
  getUserSubmissions,
  getEvaluationById,
} = require("../Controllers/Submission.Controller");

const routes = Router();

routes.post("/submitSolution", handleSubmission);
routes.get("/submissions", getUserSubmissions);
routes.get("/evaluation/:id", getEvaluationById);

module.exports = routes;
