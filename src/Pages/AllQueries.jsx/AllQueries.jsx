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
    fetch("https://product-recommendation-server-topaz.vercel.app/queries/all")
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
        return arr.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      case "oldest":
        return arr.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      case "topRec":
        return arr.sort(
          (a, b) => (b.recommendationCount || 0) - (a.recommendationCount || 0)
        );
      case "leastRec":
        return arr.sort(
          (a, b) => (a.recommendationCount || 0) - (b.recommendationCount || 0)
        );
      case "alphaAZ":
        return arr.sort((a, b) => a.productName.localeCompare(b.productName));
      case "alphaZA":
        return arr.sort((a, b) => b.productName.localeCompare(a.productName));
      default:
        return arr;
    }
  }, [queries, sortBy]);

  const filteredQueries = useMemo(() => {
    return sortedQueries.filter((q) =>
      q.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedQueries, searchTerm]);

  const handleToggleChange = (columns) => {
    setGridColumns(columns); // Update gridColumns state to control layout
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="mt-24 text-center text-red-500">Error: {error}</p>
    );
  if (!queries.length)
    return (
      <p className="mt-24 text-center">No queries found. Please check back later.</p>
    );

  return (
    <div className="mx-auto mt-24 max-w-7xl p-4">
      <Helmet>
        <title>All Queries | Recommend Product</title>
      </Helmet>
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content">
        All Queries
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar (Desktop only) */}
        <aside className="hidden lg:flex flex-col gap-6 w-64 border rounded-lg p-4 bg-base-200">
          {/* এখানে flex-col + gap দিয়ে কন্টেন্ট অনুযায়ী হাইট হবে */}
          <div className="font-medium text-lg text-base-content">
            Total Queries: {filteredQueries.length}
          </div>

          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border p-2"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="topRec">Top Recommendations</option>
            <option value="leastRec">Least Recommendations</option>
            <option value="alphaAZ">Product A → Z</option>
            <option value="alphaZA">Product Z → A</option>
          </select>

          <div className="flex justify-center gap-6 py-6">
            {[1, 2, 3].map((num) => (
              <label key={num} className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridColumns === num}
                  onChange={() => handleToggleChange(num)}
                  className="toggle toggle-success"
                />
                <span className="absolute -top-6 right-1/2 text-base-content z-10 select-none">
                  {num}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Mobile Sticky Controls */}
          <div className="lg:hidden sticky top-0 z-20 bg-base-200 p-4 shadow-md rounded-lg mb-6">
            <div className="mb-3 font-medium text-lg text-center">
              Total Queries: {filteredQueries.length}
            </div>

            <input
              type="text"
              placeholder="Search by Product Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border p-2 mb-4"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="topRec">Top Recommendations</option>
              <option value="leastRec">Least Recommendations</option>
              <option value="alphaAZ">Product A → Z</option>
              <option value="alphaZA">Product Z → A</option>
            </select>

            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((num) => (
                <label key={num} className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gridColumns === num}
                    onChange={() => handleToggleChange(num)}
                    className="toggle toggle-success"
                  />
                  <span className="absolute -top-6 right-1/2 text-base-content z-10 select-none">
                    {num}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Grid View */}
          {filteredQueries.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No queries match your search.
            </p>
          ) : (
            <div
              className={`grid gap-6 grid-cols-1 ${
                gridColumns === 2 ? "sm:grid-cols-2" : ""
              } ${gridColumns === 3 ? "lg:grid-cols-3" : ""}`}
            >
              {filteredQueries.map((q) => (
                <div
                  key={q._id}
                  className="relative flex flex-col justify-between border border-base-300 rounded-lg p-4 shadow-md bg-base-300 text-base-content"
                >
                  {q.recommendationCount > 0 && (
                    <span className="badge badge-success p-1 badge-sm absolute top-0 right-0">
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
                    <p className="mb-1">
                      <span className="font-medium">Query:</span> {q.queryTitle}
                    </p>
                    <p className="mb-3">
                      <span className="font-medium">Recommendations:</span>{" "}
                      {q.recommendationCount || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/query-details/${q._id}`)}
                    className="mt-auto btn btn-primary"
                  >
                    Recommend
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllQueries;
