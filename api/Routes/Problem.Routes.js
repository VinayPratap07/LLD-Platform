const { Router } = require("express");
const {
  getAllProblems,
  getProblemById,
  createProblem,
} = require("../Controllers/Problem.Controller");

const routes = Router();

routes.get("/getProblems", getAllProblems);
routes.post("/createProblem", createProblem);
routes.get("/getProblemById/:id", getProblemById);

module.exports = routes;
