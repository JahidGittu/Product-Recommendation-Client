import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/queries")  
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch queries");
        return res.json();
      })
      .then((data) => {
        // Sort descending by timestamp (if server doesn't already do it)
        const sorted = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setQueries(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading queries...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!queries.length)
    return <p>No queries found. Please check back later.</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto mt-24">
      <h2 className="text-3xl font-bold mb-6 text-center">All Queries</h2>
      {/* Responsive grid: 1 col on small, 2 on md, 3 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {queries.map((query) => (
          <div
            key={query._id}
            className="border rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{query.productName}</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Query:</span> {query.queryTitle}
              </p>
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Recommendations:</span>{" "}
                {query.recommendationCount || 0}
              </p>
            </div>

            <button
              onClick={() => navigate(`/query-details/${query._id}`)}
              className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Recommend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllQueries;
