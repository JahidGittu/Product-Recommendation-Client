import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Form.css';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../../Shared/SocialLogin/SocialLogin';

const Form = () => {
    const { createUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasSpecialChar: false,
        isLongEnough: false
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handlePasswordChange = (e) => {
        const password = e.target.value;

        setPasswordValidation({
            hasNumber: /\d/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasSpecialChar: /[^\w\s]/.test(password),
            isLongEnough: password.length >= 6
        });
    };

    const handleSignUp = (e) => {
        setIsPasswordFocused(false);
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photo = form.photo.value;
        const email = form.email.value;
        const password = form.password.value;

        // Firebase sign-up
        createUser(email, password)
            .then(result => {
                const user = result.user;  // Firebase user object থেকে

                // Update Firebase profile
                updateUser({
                    displayName: name,
                    photoURL: photo
                })
                    .then(() => {
                        // After successful Firebase profile update, send data to server
                        sendProfileDataToServer(user.uid, name, photo, email);

                        Swal.fire({
                            title: "Registration Successful!",
                            icon: "success",
                            draggable: true
                        });

                        navigate("/"); // Redirect to the homepage or dashboard
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Profile Update Failed',
                            text: error.message,
                            icon: 'error'
                        });
                    });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Registration Failed',
                    text: error.message,
                    icon: 'error'
                });
            });
    };

    const sendProfileDataToServer = async (userId, name, photo, email) => {
        const profileData = {
            userId,
            name,
            photo,
            email,
        };

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                console.log('Profile data sent to server successfully');
            } else {
                console.error('Failed to send profile data to server');
            }
        } catch (error) {
            console.error('Error sending profile data to server:', error);
        }
    };

    const handleFocus = () => {
        setIsPasswordFocused(true);
        setShowPass(true);
    };

    const handleBlur = () => {
        setShowPass(false);
    };

    return (
        <div className="signup-form">
            <form onSubmit={handleSignUp} className="space-y-4">
                {/* Name */}
                <div className="input-wrapper">
                    <input
                        name="name"
                        type="text"
                        id="name"
                        placeholder=" "
                        required
                        className="p-2 py-3 w-full rounded-md focus:outline-none border-b text-accent border-gray-600"
                    />
                    <label htmlFor="name" className="floating-placeholder">Name</label>
                </div>

                {/* Photo URL */}
                <div className="input-wrapper">
                    <input
                        name="photo"
                        type="text"
                        id="photo"
                        placeholder=" "
                        required
                        className="p-2 py-3 w-full rounded-md focus:outline-none border-b text-accent border-gray-600"
                    />
                    <label htmlFor="photo" className="floating-placeholder">Photo URL</label>
                </div>

                {/* Email */}
                <div className="input-wrapper">
                    <input
                        name="email"
                        type="email"
                        id="email"
                        placeholder=" "
                        required
                        className="p-2 py-3 w-full rounded-md focus:outline-none border-b text-accent border-gray-600"
                    />
                    <label htmlFor="email" className="floating-placeholder">Email</label>
                </div>

                {/* Password */}
                <div className="space-y-1 text-sm">
                    <div className="relative input-wrapper">
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder=" "
                            required
                            className="w-full p-2 py-3 rounded-md focus:outline-none border-b text-accent border-gray-600"
                            onChange={handlePasswordChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <label htmlFor="password" className="floating-placeholder">Password</label>
                        <span
                            onClick={() => setShowPass(!showPass)}
                            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                {/* Password Validation Rules */}
                {isPasswordFocused && (
                    <motion.div
                        className="password-validation text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: .8 }}
                    >
                        <h3 className='p-1 w-fit m-4 bg-blue-600'>Password Must Contain</h3>
                        <ul className='text-left'>
                            <li style={{ color: passwordValidation.hasUpperCase ? 'green' : 'red' }}>
                                {passwordValidation.hasUpperCase ? '✔' : '✘'} At least one uppercase letter
                            </li>
                            <li style={{ color: passwordValidation.hasLowerCase ? 'green' : 'red' }}>
                                {passwordValidation.hasLowerCase ? '✔' : '✘'} At least one lowercase letter
                            </li>
                            <li style={{ color: passwordValidation.hasNumber ? 'green' : 'red' }}>
                                {passwordValidation.hasNumber ? '✔' : '✘'} At least one number
                            </li>
                            <li style={{ color: passwordValidation.hasSpecialChar ? 'green' : 'red' }}>
                                {passwordValidation.hasSpecialChar ? '✔' : '✘'} At least one special character
                            </li>
                            <li style={{ color: passwordValidation.isLongEnough ? 'green' : 'red' }}>
                                {passwordValidation.isLongEnough ? '✔' : '✘'} Minimum 6 characters long
                            </li>
                        </ul>
                    </motion.div>
                )}

                <input type="submit" className='btn btn-primary w-full' value="Sign Up" />
            </form>

            <div className="divider">OR</div>

            {/* Google */}
            <SocialLogin />

            <span>Already have Account? <Link to="/auth/signIn">Login</Link></span>
        </div>
    );
};

export default Form;
