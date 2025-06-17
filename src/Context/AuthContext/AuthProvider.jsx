import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.init';

const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    // Create User
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    // Login User
    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (userProfile) => {
        return updateProfile(auth.currentUser, userProfile);
    };

    // check User
    // useEffect(() => {
    //     const unSubscribe = onAuthStateChanged(auth, currentUser => {
    //         setUser(currentUser);
    //         setLoading(false);

    //         if (currentUser?.email) {
    //             const userData = { email: currentUser.email };
    //             axios.post('https://product-recommendation-server-topaz.vercel.app/jwt', userData, {
    //                 withCredentials: true
    //             })
    //                 .then(res => {
    //                     console.log('JWT response:', res.data);
    //                 })
    //                 .catch(error => {
    //                     console.log('Error with JWT:', error);
    //                     setLoading(false);
    //                 });
    //         }

    //         console.log('Current User', currentUser);
    //     });

    //     return () => {
    //         unSubscribe();
    //     };
    // }, []);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            // console.log('User in the auth state change', currentUser);
        });
        return () => unSubscribe();
    }, []);



    // Google Sign in
    const signinWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }

    // Signout user

    const logout = () => {
        setLoading(true)
        return signOut(auth)
    }



    const authInfo = {
        loading,
        createUser,
        signInUser,
        updateUser,
        user,
        setUser,
        signinWithGoogle,
        logout

    }

    return (

        < AuthContext value={authInfo}>
            {children}
        </AuthContext >

    );
};

export default AuthProvider;