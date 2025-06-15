import React from 'react';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mt-24 mx-auto p-6 text-center bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg shadow-xl">
            <Helmet>
                <title>About Us | Recommend Product</title>
            </Helmet>
            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-wide">
                About Us
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed">
                Recommend Product is a platform dedicated to providing personalized product recommendations based on your preferences, lifestyle, and needs.
                Our goal is to make your shopping experience smoother by offering curated product suggestions tailored just for you. Whether you're looking for electronics, fashion, or home goods, we are here to help you make informed purchasing decisions.
            </p>
            <div className="mt-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Why Choose Us?</h3>
                <ul className="text-lg text-white list-disc list-inside">
                    <li>Personalized Product Recommendations</li>
                    <li>Easy Shopping Experience</li>
                    <li>Detailed Reviews and Ratings</li>
                    <li>Wide Range of Categories</li>
                    <li>Time-Saving and Reliable Suggestions</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutUs;
