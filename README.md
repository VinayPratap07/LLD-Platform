# LLD Practice Platform

A focused practice platform for learning and improving Low-Level Design (LLD).

The application follows the learner loop:

**Choose Problem → Think / Design → Submit → Evaluate → Review Feedback → Try Again**

The project was built as a focused MVP for the CipherSchools LLD Practice Platform assignment. The goal is not to provide a large LMS or assessment system, but to make repeated LLD practice and explainable feedback possible.

## 1. Problem

LLD problems such as Parking Lot, Elevator, or Vending Machine can have multiple valid designs. A learner therefore needs more than a simple right/wrong result.

The platform is designed to let a learner:

- Select an LLD problem.
- Understand its requirements.
- Submit a solution.
- Track the submission/evaluation state.
- Receive structured feedback.
- Review previous attempts.
- Improve and submit another attempt.

This directly follows the assignment's intended practice loop and keeps the product focused on the learner journey.

## 2. MVP Features

### Problem Practice

- A learner can select an LLD problem.
- Each problem provides enough requirements/context to attempt a solution.
- The submission format is kept focused rather than trying to support every possible format.

### Submission

The backend treats submission as a domain operation rather than putting all business logic inside the controller.

The submission flow is conceptually:

```text
HTTP Request
     ↓
Controller
     ↓
Submission Service
     ↓
Domain Validation
     ↓
Repository
     ↓
Database
```

This keeps request handling, business rules, and persistence separate.

### Evaluation

Submitted work can move through an evaluation lifecycle:

```text
Submitted
    ↓
Evaluating
    ↓
Completed
    or
Failed
```

The evaluation layer is responsible for obtaining the submission/problem information and producing feedback.

AI is used for judgment-heavy parts of evaluation, such as reasoning about:

- Class responsibilities
- Abstractions
- Coupling/cohesion
- Design trade-offs
- SOLID-related concerns
- Improvement suggestions
- Explanation quality

Deterministic validation remains outside the LLM where possible.

### Attempt History

Previous submissions/evaluations are retained so the learner can review earlier work instead of treating every attempt as an isolated exercise.

## 3. Architecture

The backend follows a layered/domain-oriented structure.

```text
                ┌───────────────┐
                │    Client     │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │   Controller  │
                │ HTTP concerns │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Service    │
                │ Use-case flow │
                └───────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      ┌─────────────┐       ┌──────────────┐
      │   Domain    │       │  Repository  │
      │Business     │       │ Persistence   │
      │rules        │       │ operations    │
      └─────────────┘       └──────┬───────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │  Database   │
                            └─────────────┘
```

### Controller

Responsible for HTTP-level concerns:

- Reading request data.
- Calling the appropriate application service.
- Returning HTTP responses.
- Mapping errors to appropriate responses.

Controllers should not contain the complete business workflow.

### Service

The service acts as the application/use-case coordinator.

For example:

```text
submitSubmission()
        ↓
validate submission
        ↓
create submission
        ↓
create evaluation / trigger evaluation
        ↓
return result
```

It coordinates multiple domain and persistence operations without owning every business rule itself.

### Domain

The domain contains rules that describe what is valid from a business perspective.

For example:

- Whether a submission contains the required information.
- Whether a particular operation is allowed.
- Domain-level state transitions.
- Rules that should remain independent of Express or MongoDB.

This is intentionally separated so business rules are easier to test and reuse.

### Repository

Repositories handle persistence.

Typical responsibilities include:

- Creating records.
- Finding submissions.
- Finding previous attempts.
- Updating evaluation state.
- Fetching problem/evaluation data.

The service normally coordinates repositories instead of controllers accessing repositories directly. This keeps the application flow consistent and gives the domain/application layer a stable boundary around persistence.

## 4. Evaluation Design

The evaluation approach intentionally does not treat one reference implementation as the only correct answer.

The feedback model is based on design dimensions such as:

- Requirement understanding
- Class responsibilities
- Coupling and cohesion
- Encapsulation and interfaces
- Abstraction/pattern usage
- Extensibility
- Edge cases and testability
- Quality of explanation

The assignment specifically recommends separating deterministic checks from judgment-heavy AI evaluation. This project follows that principle.

### Deterministic responsibilities

Examples:

- Required-field validation.
- Submission structure validation.
- Submission/evaluation state handling.
- Persistence.
- Duplicate/idempotency-related checks where applicable.

### AI-assisted responsibilities

Examples:

- Reasoning about design quality.
- Analysing responsibilities and abstractions.
- Identifying design trade-offs.
- Suggesting improvements.
- Analysing the learner's explanation.

The AI is therefore used as an evaluator/reasoning component rather than as the source of every application rule.

## 5. AI Evaluation

The project uses a locally hosted Ollama-based LLM integration for evaluation.

The general flow is:

```text
Submission
    ↓
Load Submission + Problem
    ↓
Build Evaluation Input
    ↓
LLM Evaluation
    ↓
Structured Evaluation Result
    ↓
Persist Result
    ↓
Show Feedback
```

The prompt is constrained around the evaluation criteria rather than asking an unconstrained question such as:

> "Is this a good design?"

The purpose is to make feedback more explainable and tied to evidence from the submitted solution.

## 6. Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios

### Backend

- Node.js
- Express.js
- JavaScript
- MongoDB Atlas
- Mongoose

### AI

- Ollama
- Local LLM evaluation

### Development

- Git / GitHub
- VS Code
- REST API based frontend/backend communication

> If the repository uses a different exact package/model version, use the versions declared in the repository's `package.json` files as the source of truth.

## 7. Project Structure

The exact file names may evolve, but the intended backend organization is:

```text
backend/
├── controllers/
│   └── ...
├── services/
│   └── ...
├── domain/
│   └── ...
├── repositories/
│   └── ...
├── models/
│   └── ...
├── routes/
│   └── ...
├── utils/
│   └── ...
└── index.js
```

Frontend:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── API/
│   ├── main.tsx
│   └── ...
└── ...
```

The important architectural boundary is:

```text
Controller → Service → Domain / Repository
```

rather than placing all application logic inside route handlers/controllers.

## 8. Prerequisites

Install:

- Node.js
- npm
- MongoDB or access to a MongoDB deployment
- Ollama
- A compatible local LLM model

Check installations:

```bash
node --version
npm --version
ollama --version
```

## 9. Installation

Clone the repository and install dependencies for the backend and frontend.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

If the repository uses different directory names, run `npm install` from the corresponding application directories.

## 10. Environment Variables

Create the backend `.env` file from the variables expected by the project's configuration.

Typical values are:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OLLAMA_HOST=http://localhost:11434
```

Use the actual variable names already defined in the project configuration. Do not commit `.env` files or API keys/secrets to Git.

## 11. Running Ollama

Start Ollama locally:

```bash
ollama serve
```

Pull the model configured by the project if it is not already available:

```bash
ollama pull <model-name>
```

The exact model should match the model configured in the evaluation service.

## 12. Run the Application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally be available at the local URL printed by Vite.

The backend URL/port is determined by the project's environment configuration.

## 13. Typical User Flow

```text
1. Open the application
        ↓
2. Select an LLD problem
        ↓
3. Read requirements
        ↓
4. Write the solution
        ↓
5. Submit
        ↓
6. Submission is persisted
        ↓
7. Evaluation begins
        ↓
8. Evaluation completes / fails
        ↓
9. Review structured feedback
        ↓
10. Review previous attempts
        ↓
11. Try again
```

The assignment explicitly expects an end-to-end flow from problem selection through feedback and attempt history.

## 14. Key Design Decisions

### 1. Layered/domain-oriented backend

Business logic is separated from HTTP and persistence concerns.

This makes it easier to:

- Test domain rules independently.
- Change persistence implementation later.
- Keep controllers small.
- Add other evaluation approaches without rewriting the entire submission flow.

### 2. Service as the use-case coordinator

The service layer coordinates a complete application operation.

For example, submission handling may involve validation, persistence, and evaluation setup. Putting that workflow in a service prevents the controller from becoming a large business-logic file.

### 3. Domain validation separated from persistence

A repository should answer persistence questions such as:

```text
"Does this submission exist?"
"Save this submission."
"Find previous submissions."
```

The domain should answer business questions such as:

```text
"Is this submission valid?"
"Can this state transition happen?"
```

This distinction keeps the code easier to reason about.

### 4. Evaluation separated from submission

Submitting a solution and evaluating its design are different responsibilities.

The submission should be stored before evaluation so that an evaluation failure does not lose the learner's work.

### 5. AI is not the entire evaluator

Deterministic application rules remain deterministic.

The LLM is used where subjective reasoning is valuable. This makes the evaluation process more predictable and gives the application a clear place to add another evaluator later.

### 6. Structured evaluation

The evaluator is expected to produce structured information rather than only a free-form paragraph.

Conceptually:

```text
criterion
score/assessment
evidence
concern
suggestion
confidence
```

This makes feedback easier to display, store, and extend.

## 15. Extensibility

The design considers two changes from the assignment.

### New submission format

Today:

```text
Text / code based submission
```

Potential future format:

```text
Class diagram / UML
```

The application flow should not need to be completely rewritten because submission handling and evaluation are separated from HTTP and persistence details.

### New evaluator

Today:

```text
LLM evaluator
```

Potential future evaluators:

```text
RuleBasedEvaluator
LLMEvaluator
HumanEvaluator
```

A common evaluator contract can allow these implementations to be introduced without rewriting the learner's practice flow.

Conceptually:

```js
class Evaluator {
  async evaluate(submission, problem) {
    // evaluator contract
  }
}
```

The concrete implementation can then be selected by the application layer.

## 16. Error and Failure Handling

Evaluation is treated as a separate step from submission.

The intended behaviour is:

```text
Submit
  ↓
Persist submission
  ↓
Start evaluation
  ↓
Completed
   OR
Failed
```

If the evaluator fails, the saved submission remains available for review/retry.

This follows the assignment's guidance to avoid losing submissions when AI evaluation fails.

## 17. Testing

Important behaviour should be tested around:

- Submission validation.
- Required fields.
- Invalid submission types.
- Submission persistence.
- Evaluation state changes.
- Evaluation failure handling.
- Retrieval of previous submissions.
- Domain rules independent of HTTP/database details.

At minimum, include failure/edge cases rather than testing only the successful path.

## 18. Limitations

This is a focused 2-day MVP rather than a production-scale assessment platform.

Current limitations include:

- AI evaluation can depend on local model availability and response quality.
- LLM feedback is not guaranteed to be perfectly consistent.
- The platform does not claim that one design is the only valid LLD solution.
- The supported submission format is intentionally limited.
- Evaluation is not intended to replace expert human review.
- Authentication/authorization and production deployment concerns may be simplified depending on the prototype configuration.
- The project is a monolith; distributed infrastructure is intentionally out of scope.
- The LLM evaluator can be slower than deterministic validation because inference happens separately.

## 19. Scope

The assignment explicitly prioritizes LLD/domain design over large-scale HLD. Therefore this project intentionally does not introduce unnecessary:

- Microservices
- Kubernetes
- Multi-region deployment
- Sharding
- CDN architecture
- Complex distributed queues

The architecture is kept simple enough to demonstrate domain boundaries and engineering judgement.

## 20. Assignment Alignment

The assignment asks for:

| Requirement      | Project approach                           |
| ---------------- | ------------------------------------------ |
| Problems         | LLD problems with requirements/context     |
| Practice         | Learner writes a solution                  |
| Submission       | Submission persisted through the backend   |
| Feedback         | Structured AI-assisted evaluation          |
| History          | Previous attempts/evaluations are retained |
| Core design      | Domain/service/repository separation       |
| Evaluation       | Deterministic checks + LLM reasoning       |
| Extensibility    | Separate evaluator/application boundaries  |
| Failure handling | Submission persisted before evaluation     |
| Testing          | Validation, failure and edge-case tests    |

The assignment also specifically asks for meaningful AI usage documentation; that is provided in [`AI_USAGE.md`](./AI_USAGE.md).

## 21. What This Project Demonstrates

The main engineering focus is not the number of features. It is the separation of responsibilities around the core practice workflow:

```text
Problem
   ↓
Submission
   ↓
Evaluation
   ↓
Feedback
   ↓
History
   ↓
Improved Attempt
```

The backend design makes the core behaviour explicit while keeping infrastructure details replaceable.
