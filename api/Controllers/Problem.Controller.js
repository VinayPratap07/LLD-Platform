const { Problems } = require("../Models/Problem.Model");

async function createProblem(req, res) {
  const { title, description, requirements, difficulty } = req.body;

  if (!title || !description || !requirements || !difficulty) {
    return res.status(422).json({ message: "All fields are required" });
  }

  try {
    const problem = await Problems.create({
      title,
      description,
      requirements,
      difficulty,
    });

    return res.status(201).json({
      message: "Problem created successfully",
      probelmId: problem._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPatterns)[0];

      return res.status(409).json({
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getAllProblems(req, res) {
  try {
    const problems = await Problems.find({});

    return res.status(200).json({ message: "sucess", data: problems });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getProblemById(req, res) {
  const probelmId = req.params.id;

  if (!probelmId) {
    return res.status(400).json({
      message: "Ingredient not found!!!",
    });
  }

  try {
    const problem = await Problems.findById(probelmId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "success", data: problem });
  } catch (error) {}
}

module.exports = { createProblem, getAllProblems, getProblemById };
