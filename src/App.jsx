import { createBrowserRouter, RouterProvider } from "react-router";

import MainLayout from "./layout/MainLayout";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import Login from "./pages/LogInPage/LogInPage";
import Dashboard from "./pages/Dashboard/DashBoardPage";
 
const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <p>Welcome! Please login or sign up.</p>,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: SignUpPage,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}