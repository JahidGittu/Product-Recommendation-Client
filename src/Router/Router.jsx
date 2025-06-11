import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import SignUp from "../Pages/SignUp/SignUp";
import RootLayouts from "../Layouts/RootLayouts";
import SignIn from "../Pages/SignIn/SignIn";
import AuthLayout from "../Layouts/AuthLayout";
import Home from "../Pages/Home/Home";
import PrivateRoutes from "../Routes/PrivateRoutes";
import MyQueries from "../Pages/PrivatePages/My Queries/MyQueries";
import AddQuery from "../Pages/PrivatePages/AddQuery/AddQuery";
import QueryDetails from "../Pages/PrivatePages/QueryDetails/QueryDetails";
import UpdateQuery from "../Pages/PrivatePages/UpdateQuery/UpdateQuery";
import AllQueries from "../Pages/AllQueries.jsx/AllQueries";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts></RootLayouts>,
        errorElement: <h1>Error</h1>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: "/my-Queries",
                element: <PrivateRoutes><MyQueries></MyQueries></PrivateRoutes>,
            },
            {
                path: "/add-Query",
                element: <PrivateRoutes><AddQuery></AddQuery></PrivateRoutes>
            },
            {
                path: "/Queries",
                element: <AllQueries></AllQueries>
            },
            {
                path: "/query-details/:id",
                element: <PrivateRoutes><QueryDetails /></PrivateRoutes>
            },
            {
                path: "/update-query/:id",
                element: <PrivateRoutes> <UpdateQuery /> </PrivateRoutes>
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
    },



]);

export default router;