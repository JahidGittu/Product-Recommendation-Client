import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import Loading from "../Shared/Loading/Loading";

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState(3); // default 3-column

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://product-recommendation-server-topaz.vercel.app/queries/all")  // Just get the queries
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch queries");
        return res.json();
      })
      .then((data) => {
        setQueries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const sortedQueries = useMemo(() => {
    const arr = [...queries];
    switch (sortBy) {
      case "newest":
        return arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case "oldest":
        return arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case "topRec":
        return arr.sort((a, b) => (b.recommendationCount || 0) - (a.recommendationCount || 0));
      case "leastRec":
        return arr.sort((a, b) => (a.recommendationCount || 0) - (b.recommendationCount || 0));
      case "alphaAZ":
        return arr.sort((a, b) => a.productName.localeCompare(b.productName));
      case "alphaZA":
        return arr.sort((a, b) => b.productName.localeCompare(a.productName));
      default:
        return arr;
    }
  }, [queries, sortBy]);

  const handleToggleChange = (columns) => {
    setGridColumns(columns); // Update gridColumns state to control layout
  };

  const filteredQueries = useMemo(() => {
    return sortedQueries.filter((q) =>
      q.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedQueries, searchTerm]);

  if (loading) return <Loading></Loading>;
  if (error) return <p className="mt-24 text-center text-red-500">Error: {error}</p>;
  if (!queries.length)
    return <p className="mt-24 text-center">No queries found. Please check back later.</p>;

  return (
    <div className="mx-auto mt-24 max-w-7xl p-4">
      <Helmet>
        <title>All Queries | Recommend Product</title>
      </Helmet>
      <h2 className="text-3xl font-bold text-center mb-8">All Queries</h2>

      {/* ---------- Controls Section ---------- */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 items-center">
        <div className="text-center sm:text-left text-lg font-medium text-gray-700">
          Total Queries: {filteredQueries.length}
        </div>

        <div className="text-center">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 md:w-full rounded border p-2"
          />
        </div>

        <div className="flex justify-center sm:justify-end gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border p-2"
          >
            <option className="bg-base-300" value="newest">Newest First</option>
            <option className="bg-base-300" value="oldest">Oldest First</option>
            <option className="bg-base-300" value="topRec">Top Recommendations</option>
            <option className="bg-base-300" value="leastRec">Least Recommendations</option>
            <option className="bg-base-300" value="alphaAZ">Product A → Z</option>
            <option className="bg-base-300" value="alphaZA">Product Z → A</option>
          </select>
        </div>
      </div>

      {/* 🧲 Fancy Layout Toggle Switch */}
      <div className="flex justify-center items-center py-6 gap-6">
        <label className="relative">
          <input
            type="checkbox"
            checked={gridColumns === 1}
            onChange={() => handleToggleChange(1)}
            className="toggle toggle-success"
          />
          <span className="absolute -top-6 right-1/2 active:text-accent z-10">1</span>
        </label>

        <label className="relative">
          <input
            type="checkbox"
            checked={gridColumns === 2}
            onChange={() => handleToggleChange(2)}
            className="toggle toggle-success"
          />
          <span className="absolute -top-6 right-1/2 active:text-accent z-10">2</span>
        </label>

        <label className="relative">
          <input
            type="checkbox"
            checked={gridColumns === 3}
            onChange={() => handleToggleChange(3)}
            className="toggle toggle-success"
          />
          <span className="absolute -top-6 right-1/2 active:text-accent z-10">3</span>
        </label>
      </div>

      {/* ---------- Grid View ---------- */}
      {filteredQueries.length === 0 ? (
        <p className="text-center text-gray-500">No queries match your search.</p>
      ) : (
        <div className={`grid gap-6 grid-cols-1 ${gridColumns === 2 ? "sm:grid-cols-2" : ""} ${gridColumns === 3 ? "lg:grid-cols-3" : ""}`}>
          {filteredQueries.map((q) => (
            <div
              key={q._id}
              className="relative flex flex-col justify-between rounded-lg border p-4 shadow">
              {q.recommendationCount > 0 && (
                <span className="badge bg-green-200 p-1 badge-sm absolute top-0 right-0">
                  Reco Added
                </span>
              )}
              {q.productImage && (
                <img
                  src={q.productImage}
                  alt={q.productName}
                  className="mb-4 h-40 w-full object-cover rounded"
                />
              )}

              <div>
                <h3 className="mb-2 text-xl font-semibold">{q.productName}</h3>
                <p className="mb-1 text-amber-50">
                  <span className="font-medium ">Query:</span> {q.queryTitle}
                </p>
                <p className="mb-3 text-amber-50 ">
                  <span className="font-medium ">Recommendations:</span>{" "}
                  {q.recommendationCount || 0}
                </p>
              </div>

              <button
                onClick={() => navigate(`/query-details/${q._id}`)}
                className="mt-auto rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700">
                Recommend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllQueries;
