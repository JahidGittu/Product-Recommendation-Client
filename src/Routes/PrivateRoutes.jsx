import React from 'react';
import { AuthContext } from '../Context/AuthContext/AuthContext';
import { Navigate, useLocation } from 'react-router';

import useAuth from '../hooks/useAuth';
import Loading from '../Pages/Shared/Loading/Loading';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading/>
    }

    if (!user) {
        return <Navigate to="/auth/signIn" state={location.pathname}></Navigate>
    }

    return children
};

export default PrivateRoutes;