import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Register from "./pages/SignUpPage/SignUpPage";
import Login from "./pages/LogInPage/LogInPage";
import Dashboard from "./pages/Dashboard/DashBoardPage";



  
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <p>Welcome! Please login or sign up.</p>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: 
          <Dashboard />
        ,
      },
    ],
  },
]);
    
  


export default function App(){
   return <RouterProvider router={router} />
};