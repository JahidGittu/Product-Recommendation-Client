import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import SignUp from "../Pages/SignUp/SignUp";
import RootLayouts from "../Layouts/RootLayouts";
import SignIn from "../Pages/SignIn/SignIn";
import AuthLayout from "../Layouts/AuthLayout";
import Home from "../Pages/Home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts></RootLayouts>,
        errorElement: <h1>Error</h1>,
        children: [
            {
                index:true,
                element:<Home></Home>
            },
        ]

    },
    {
        path: "/auth",
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                index: true,
                path: "/auth/signIn",
                element: <SignIn></SignIn>
            },
            {
                path: "/auth/SignUp",
                element: <SignUp></SignUp>
            }
        ]
    }


]);

export default router;