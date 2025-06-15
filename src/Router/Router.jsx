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
import MyRecommendations from "../Pages/PrivatePages/MyRecommendations/MyRecommendations";
import RecoForMe from "../Pages/PrivatePages/RecoForMe/RecoForMe";
import AboutUs from "../Pages/WebsiteInfo/AboutUs";
import ContactUs from "../Pages/WebsiteInfo/ContactUs";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Profile from "../Pages/Profile/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts></RootLayouts>,
        errorElement: <ErrorPage></ErrorPage>,
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
                path: "/Recommendation-for-me",
                element: <PrivateRoutes> <RecoForMe /> </PrivateRoutes>
            },
            {
                path: "/Queries",
                element: <AllQueries></AllQueries>
            },
            {
                path: "/my-recommendations",
                element: <PrivateRoutes><MyRecommendations />  </PrivateRoutes>
            },
            {
                path: "/query-details/:id",
                element: <PrivateRoutes><QueryDetails /></PrivateRoutes>
            },
            {
                path: "/update-query/:id",
                element: <PrivateRoutes> <UpdateQuery /> </PrivateRoutes>
            },
            {
                path: "/about-us",
                element: <AboutUs></AboutUs>
            },
            {
                path: "/contact-us",
                element: <ContactUs></ContactUs>
            },
            {
                path: "/my-profile",
                element: <PrivateRoutes><Profile></Profile></PrivateRoutes>
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