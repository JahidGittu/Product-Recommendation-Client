import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.init';

const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setuser] = useState(null)

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
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setuser(currentUser)
            setLoading(false)
            console.log("Current User ", currentUser)
        })
        return () => {
            unSubscribe();
        }
    }, [])

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
        setuser,
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