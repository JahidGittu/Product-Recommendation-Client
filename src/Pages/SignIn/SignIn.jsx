import React, { useState } from 'react';
import signinLottie from '../../assets/Lotties/SignIn.json';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './SignIn.css';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import Loading from '../Shared/Loading/Loading';
import { Helmet } from 'react-helmet';

const SignIn = () => {
  const { loading, setLoading, signInUser } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state || '/';

  const [showPass, setShowPass] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    setPasswordValidation({
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[^\w\s]/.test(password),
      isLongEnough: password.length >= 6,
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsPasswordFocused(false);
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signInUser(email, password)
      .then((result) => {
        Swal.fire({
          title: 'Login Successful!',
          icon: 'success',
          text: result.user.email,
        });
        setLoading(false);
        navigate(from);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Login Failed',
          text: error.message,
          icon: 'error',
        });
        setLoading(false);  // <== এটা যোগ করতে ভুল করা যাবে না
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <Helmet>
        <title>Sign-In | Recommend Product</title>
      </Helmet>
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Left Lottie Animation */}
        <div className="text-center lg:text-left">
          <Lottie style={{ width: '300px' }} animationData={signinLottie} loop={true} />
        </div>

        {/* Right Form Section */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl font-bold py-4">Login now!</h1>

            <form onSubmit={handleSignIn}>
              <fieldset className="fieldset">
                <div className="relative input-wrapper">
                  <input
                    name="email"
                    type="email"
                    className="p-2 w-full rounded-md focus:outline-none border-b border-gray-600 peer"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email" className="floating-placeholder">Email</label>
                </div>

                <div className="relative mt-4 input-wrapper">
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="p-2 w-full rounded-md focus:outline-none border-b border-gray-600 peer"
                    placeholder=" "
                    required
                    onChange={handlePasswordChange}
                    onFocus={() => {
                      setShowPass(true);
                      setIsPasswordFocused(true);
                    }}
                    onBlur={() => {
                      setShowPass(false);
                      setIsPasswordFocused(false);
                    }}
                  />
                  <label htmlFor="password" className="floating-placeholder">Password</label>

                  <span
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-1/2 right-4 cursor-pointer -translate-y-1/2"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {isPasswordFocused && (
                  <motion.div
                    className="password-validation text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h3 className="p-1 w-fit m-4 bg-blue-600 text-white rounded-md">Password Must Contain</h3>
                    <ul className="text-left">
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

                <button type="submit" className="btn btn-neutral mt-4 w-full">Login</button>
              </fieldset>
            </form>

            <div className="divider">OR</div>

            <SocialLogin from={from} />

            <p className="text-center">
              Don't have an account?{' '}
              <Link className="text-secondary hover:underline" to="/auth/SignUp">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
