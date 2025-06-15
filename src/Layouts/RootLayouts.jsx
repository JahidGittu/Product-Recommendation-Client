import React from 'react';
import Navbar from '../Pages/Shared/Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Components/Footer';


const RootLayouts = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className='z-10'>
                <Navbar></Navbar>
            </header>

            {/* Content section that grows to fill remaining space */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default RootLayouts;
