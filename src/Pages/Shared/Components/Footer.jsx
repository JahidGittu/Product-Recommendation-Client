import React, { useState } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';
import { FaStumbleupon } from 'react-icons/fa';
import { CiLocationArrow1 } from 'react-icons/ci';
import useAuth from '../../../hooks/useAuth';

const Footer = () => {
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
            // এখানে আপনার API URL দিন
            const res = await axios.post('http://localhost:5000/subscribe', { email });
            setMessage(res.data.message || 'Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            setMessage('Failed to subscribe. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputFocus = () => {
        // যদি ইমেইল ইনপুট ফাঁকা থাকে এবং ইউজার লগিন থাকে, তখন সেট করা হবে
        if (!email && user?.email) {
            setEmail(user.email);
        }
    };

    return (
        <footer className="bg-base-200 text-base-content py-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
                
                {/* বাম পাশে লোগো এবং স্লোগান */}
                <div className="flex items-center space-x-4">
                    <img
                        src="your-logo-url-here"
                        alt="Website Logo"
                        className="w-16 h-16"
                    />
                    <span className="font-bold text-xl">Your Slogan Here</span>
                </div>

                {/* মাঝখানে ফুটার কন্টেন্ট: লিংক এবং কপিরাইট */}
                <div className="text-center lg:text-left">
                    <div className="space-x-6 mb-4">
                        <a className="link link-hover">About us</a>
                        <a className="link link-hover">Contact</a>
                        <a className="link link-hover">Jobs</a>
                        <a className="link link-hover">Press kit</a>
                    </div>
                    <div>
                        <p>Copyright © {new Date().getFullYear()} - All rights reserved by ACME Industries Ltd</p>
                    </div>
                </div>

                {/* ডান পাশে নিউজলেটার ইনপুট */}
                <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
                    <div className="flex space-x-4 relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={handleInputFocus}  // ইনপুটে ফোকাস করলে ইউজারের ইমেইল আসবে
                            className="p-3 rounded-md border-2 border-gray-300"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSubscribe}
                            className="btn btn-success btn-sm p-1 text-white absolute right-2 top-2"
                            disabled={loading}>
                            {loading ? <FaStumbleupon/> : <CiLocationArrow1 size={24}/>}
                        </button>
                    </div>
                    {message && <p className={`mt-2 text-sm ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                </div>

            </div>
        </footer>
    );
};

export default Footer;
