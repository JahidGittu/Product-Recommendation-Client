import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import newsLetterLottie from '../../../assets/Lotties/NewsLetterLottie.json';
import useAuth from '../../../hooks/useAuth';

const NewsletterSubscription = () => {
    const { user } = useAuth(); 
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email) {
            setMessage('Please enter a valid email');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:5000/subscribe', { email });
            setMessage(res.data.message);
            setEmail('');
        } catch (error) {
            setMessage('Failed to subscribe. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputFocus = () => {
        // যদি email ফাঁকা থাকে, এবং user লগইন থাকে, তখন সেট করো
        if (!email && user?.email) {
            setEmail(user.email);
        }
    };

    return (
        <div className=" bg-stone-200 rounded-xl flex flex-col lg:flex-row justify-around items-center w-[80%] lg:w-full mx-auto py-5 px-10 z-20">
            <div className="w-100">
                <div className="text-center lg:text-left">
                    <Lottie style={{ width: "300px" }} animationData={newsLetterLottie} loop={true} />
                </div>
            </div>
            <div className="text-black space-y-5 text-center lg:text-left w-full max-w-md">
                <h2 className="text-2xl lg:text-4xl text-green-500 font-bold">Get Queries News Easy!</h2>
                <p>Get Best alternatives, reviews, product deals and more.</p>
                <input
                    className="p-4 w-full rounded-xl"
                    type="email"
                    placeholder="Enter Mail..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    disabled={loading}
                />
                <button
                    className="btn btn-success px-10 text-white mt-2"
                    onClick={handleSubscribe}
                    disabled={loading}
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
                {message && <p className={`mt-2 text-sm ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default NewsletterSubscription;
