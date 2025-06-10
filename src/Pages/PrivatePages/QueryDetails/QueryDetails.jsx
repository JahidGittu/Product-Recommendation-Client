import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'; // React Router থেকে param নেওয়ার জন্য
import useAuth from '../../../hooks/useAuth'; // তোমার auth হুক যদি থাকে
import { format } from 'date-fns';

const QueryDetails = ({ theme = 'light' }) => {
    const { id } = useParams(); // URL থেকে queryId নেওয়া হচ্ছে
    const { user } = useAuth();

    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        productName: '',
        productImage: '',
        reason: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Query Details + Recommendations
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        Promise.all([
            fetch(`http://localhost:5000/queries/${id}`).then(res => res.json()),
            fetch(`http://localhost:5000/recommendations?queryId=${id}`).then(res => res.json())
        ])
            .then(([queryData, recs]) => {
                setQuery(queryData);
                setRecommendations(recs);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    // Handle form input change
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit recommendation
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to add a recommendation.');
            return;
        }

        if (!formData.title || !formData.productName || !formData.reason) {
            alert('Please fill all required fields.');
            return;
        }

        setSubmitting(true);

        // Build recommendation object
        const newRec = {
            queryId: id,
            queryTitle: query.queryTitle,
            productName: formData.productName,
            productImage: formData.productImage,
            recommendationTitle: formData.title,
            recommendationReason: formData.reason,
            userEmail: query.userEmail,
            userName: query.userName,
            recommenderEmail: user.email,
            recommenderName: user.displayName || user.email,
            timestamp: new Date().toISOString(),
        };

        try {
            // Save recommendation
            const res = await fetch(`http://localhost:5000/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRec),
            });
            const data = await res.json();

            if (data.insertedId) {
                // Increase recommendation count in query
                await fetch(`http://localhost:5000/queries/${id}/incrementRecommendation`, {
                    method: 'PATCH',
                });

                // Refresh recommendations list
                setRecommendations(prev => [...prev, newRec]);

                // Reset form
                setFormData({
                    title: '',
                    productName: '',
                    productImage: '',
                    reason: '',
                });
                alert('Recommendation added successfully!');
            } else {
                alert('Failed to add recommendation.');
            }
        } catch (error) {
            console.error(error);
            alert('Error adding recommendation');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!query) return <div className="text-center py-20 text-red-600">Query not found</div>;

    // Theme based colors
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
    const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

    return (
        <div className={`${bgColor} min-h-screen p-6 md:p-12 mt-24 ${textColor}`}>
            {/* Query Details */}
            <section className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">{query.queryTitle}</h1>

                {/* User Info */}
                <div className='flex flex-col space-y-3'>
                    <h2 className='text-gray-500'>Posted By : </h2>
                    <div className={`flex items-center gap-4 border-b ${borderColor} pb-4`}>

                        <img
                            src={query.userPhoto}
                            alt={query.userName}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{query.userName}</h2>
                            <p className="text-sm opacity-70">{query.userEmail}</p>
                            <p className="text-xs opacity-50">
                                Posted on {new Date(query.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Query Info */}
                <div className="space-y-2">
                    <p>
                        <strong>Product Name:</strong> {query.productName} ({query.productBrand})
                    </p>
                    <img
                        src={query.productImage}
                        alt={query.productName}
                        className="w-full max-w-md mx-auto rounded-lg object-cover"
                    />
                    <p className="mt-2 text-justify">
                        <strong>Boycott Reason:</strong> {query.boycottReason}
                    </p>
                    <p className="mt-2 text-sm opacity-70">❤️ {query.recommendationCount} Recommendations</p>
                </div>

                {/* Add Recommendation Form */}
                <div className={`mt-10 p-6 rounded-lg shadow ${cardBg}`}>
                    <h3 className="text-2xl font-semibold mb-4">Add a Recommendation</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label htmlFor="title" className="block mb-1 font-medium">
                                Recommendation Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter recommendation title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg} ${textColor} border ${borderColor}`}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="productName" className="block mb-1 font-medium">
                                Recommended Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="productName"
                                name="productName"
                                type="text"
                                placeholder="Enter product name"
                                value={formData.productName}
                                onChange={handleChange}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg} ${textColor} border ${borderColor}`}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="productImage" className="block mb-1 font-medium">
                                Recommended Product Image (URL)
                            </label>
                            <input
                                id="productImage"
                                name="productImage"
                                type="url"
                                placeholder="Enter image URL (optional)"
                                value={formData.productImage}
                                onChange={handleChange}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg} ${textColor} border ${borderColor}`}
                            />
                        </div>

                        <div>
                            <label htmlFor="reason" className="block mb-1 font-medium">
                                Recommendation Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                placeholder="Why do you recommend this product?"
                                value={formData.reason}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg} ${textColor} border ${borderColor}`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-indigo w-full py-2 font-semibold text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Recommendation'}
                        </button>
                    </form>
                </div>

                {/* All Recommendations */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-6">All Recommendations</h3>
                    {recommendations.length === 0 ? (
                        <p className="text-gray-500">No recommendations yet. Be the first to add one!</p>
                    ) : (
                        <ul className="space-y-6">
                            {recommendations.map((rec, i) => (
                                <li
                                    key={i}
                                    className={`p-4 rounded-lg shadow ${cardBg} border ${borderColor}`}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <img
                                            src={rec.recommenderPhoto || 'https://via.placeholder.com/40'}
                                            alt={rec.recommenderName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">{rec.recommenderName}</p>
                                            <p className="text-xs opacity-60">
                                                {format(new Date(rec.timestamp), 'PPP p')}
                                            </p>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold">{rec.recommendationTitle}</h4>
                                    <p><strong>Product:</strong> {rec.productName}</p>
                                    {rec.productImage && (
                                        <img
                                            src={rec.productImage}
                                            alt={rec.productName}
                                            className="w-48 h-32 object-cover rounded mt-2"
                                        />
                                    )}
                                    <p className="mt-2">{rec.recommendationReason}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};

export default QueryDetails;
