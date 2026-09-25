import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProblemsPage from "./Pages/Problems.Page.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProblemSolverPage } from "./Pages/ProblemSolverPage.tsx";
import LoginPage from "./Pages/Login.Page.tsx";
import SignupPage from "./Pages/Signup.Page.tsx";
import SubmissonHistory from "./Pages/SubmissonHistory.Page.tsx";
import HomePage from "./Pages/Home.Page.tsx";
import ProfilePage from "./Pages/Profile.Page.tsx";
import EvaluationPage from "./Pages/EvaluationPage.tsx";

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "problems",
        element: <ProblemsPage />,
      },
      {
        path: "problems/solve/:id",
        element: <ProblemSolverPage />,
      },
      {
        path: "submissions",
        element: <SubmissonHistory />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/evaluation/:id",
        element: <EvaluationPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={routes} />
    </StrictMode>
  </QueryClientProvider>,
);
