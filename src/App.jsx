import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import Login from "./components/LoginComponent";
import SignUpComponent from "./components/SignUpComponent";
import  AdminLogin from "./components/AdminLoginComponent"
import DashBoardPage from "./pages/DashBoardPage";
import AdminDashBoard from "./pages/AdminDashBoard";


const router = createBrowserRouter([
  {
    path:"/login", element: <Login/>
  },
  {
    path:"/signup", element: <SignUpComponent/>
  },
   {
    path:"/admin", element: <AdminLogin/>
  },
  {
    path:"/userDasboard", element: <DashBoardPage/>
  },
  {
    path:"/adminDasboard", element: <AdminDashBoard/>
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <>
          < HomePage/>
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
