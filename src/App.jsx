import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import Login from "./components/LoginComponent";
import SignUpComponent from "./components/SignUpComponent";
import DashBoardPage from "./pages/DashBoardPage";
import AdminDashBoard from "./pages/AdminDashBoard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUpComponent />,
  },
  {
    element: <ProtectedRoute allowedRole="student" />,
    children: [
      {
        path: "/userDashboard",
        element: <DashBoardPage />,
      },
      {
        path: "/userDasboard",
        element: <DashBoardPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRole="faculty" />,
    children: [
      {
        path: "/facultyDashboard",
        element: <FacultyDashboard />,
      },
      {
        path: "/facultyDasboard",
        element: <FacultyDashboard />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        path: "/adminDashboard",
        element: <AdminDashBoard />,
      },
      {
        path: "/adminDasboard",
        element: <AdminDashBoard />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <HomePage />
          </>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
