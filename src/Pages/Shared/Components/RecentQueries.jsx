import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

const RecentQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentQueries = async () => {
            try {
                const res = await fetch(`http://localhost:5000/queries/recents?limit=6`);
                const data = await res.json();
                setQueries(data);
            } catch (error) {
                setError(error);
                console.error("Error fetching recent queries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentQueries();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-600">
                <h2 className="text-xl font-semibold">Error: {error.message}</h2>
            </div>
        );
    }

    if (!queries.length) {
        return (
            <div className="text-center mt-20 text-gray-600">
                <h2 className="text-2xl font-semibold">No Recent Queries Found</h2>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Recent Queries</h1>
            <div className="grid gap-8  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {queries.map((query) => (
                    <div
                        key={query._id}
                        className="bg-white border border-gray-500 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        <img
                            src={query.productImage}
                            alt={query.productName}
                            className="rounded-t-lg h-48 w-full object-cover"
                            onError={(e) => { e.target.src = '/default-product.png'; }}
                        />
                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-semibold mb-2 text-indigo-700">{query.queryTitle}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">{query.boycottReason}</p>
                            <div className="mt-auto">
                                <div className="flex items-center mb-3">
                                    <img
                                        src={query.userPhoto}
                                        alt={query.userName}
                                        className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-300"
                                        onError={(e) => { e.target.src = '/default-user.png'; }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{query.userName}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(query.timestamp).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 text-sm font-medium mb-4">
                                    <span>Brand: {query.productBrand}</span>
                                    <span>Recommendations: {query.recommendationCount}</span>
                                </div>
                                <hr className="my-2 border-t border-gray-300" />
                                <div className="flex justify-center">
                                    <button
                                        className="bg-indigo-600 w-full text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                    >
                                        <Link to={`/query-details/${query._id}`}>View Query Details</Link>

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section >
    );
};

export default RecentQueries;
