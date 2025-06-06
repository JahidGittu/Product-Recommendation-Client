import React from 'react';
import Navbar from '../Pages/Shared/Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Components/Footer';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;