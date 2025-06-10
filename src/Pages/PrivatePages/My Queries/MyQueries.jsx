import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const MyQueries = () => {

  const [myQueries, setMyQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user?.email) {
      fetch(`http://localhost:5000/queries?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setMyQueries(data);
          console.log(data)
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user posts:", err);
          setLoading(false);
        });
    }
  }, [authLoading, user]);


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once it's gone, even Ctrl+Z can't Revert This!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/queries/${id}`, {
          method: "DELETE"
        })
          .then(res => res.json())
          .then(data => {
            if (data.deletedCount > 0) {
              setMyQueries(prevQueries => prevQueries.filter(post => post._id !== id));
              Swal.fire("Deleted!", "Your query has been deleted.", "success");
            }
          });
      }
    });
  };



  return (
    <div className="min-h-screen bg-base-100 space-y-6">
      {/* Banner */}
      <div className=" bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500  text-white min-h-[400px] flex flex-col justify-center items-center py-10 text-center mb-8 ">
        <h1 className="text-3xl md:text-4xl font-bold">Your Product Queries</h1>
        <p className="mt-2">Manage and update your posted product queries</p>
        <Link to="/add-Query">
          <button className="btn btn-active mt-4 bg-white text-blue-600 hover:bg-gray-100">➕ Add New Query</button>
        </Link>
      </div>

      {/* Queries Section */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : myQueries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium">No queries found. Want to add one?</p>
          <Link to="/add-Query">
            <button className="mt-4">➕ Add Query</button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {myQueries.map(query => (
            <div key={query._id} className="shadow-xl p-4 rounded-xl bg-base-300 border border-gray-600 flex flex-col justify-between h-full space-y-3">

              <div className='space-y-3'>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={query.userPhoto}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                  <div>
                    <h2 className="font-semibold">{query.userName}</h2>
                    <p className="text-sm text-gray-500">{new Date(query.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>

                <img
                  src={query.productImage}
                  alt={query.productName}
                  className="rounded-xl w-full h-48 object-cover mb-4"
                />

                <h3 className="text-xl font-bold">{query.productName} ({query.productBrand})</h3>

                <p className="text-base font-medium mt-2">❓ {query.queryTitle}</p>

                <p className="text-sm text-justify text-gray-600 mt-2">
                  🚫 Reason: {query.boycottReason.length > 200
                    ? `${query.boycottReason.slice(0, 200)}...`
                    : query.boycottReason}
                  {query.boycottReason.length > 200 && (
                    <Link to={`/query/details/${query._id}`}>
                      <span className="mt-2 inline-block text-secondary hover:underline">
                        Read More...
                      </span>
                    </Link>
                  )}
                </p>

                <p className="text-sm text-gray-500 mt-2">❤️ {query.recommendationCount} Recommendations</p>
              </div>

              {/* Button Section - Always at Bottom */}
              <div className="mt-auto pt-4 border-t-4 border-dashed border-gray-300 flex justify-between items-center">
                <Link to={`/query/details/${query._id}`}>
                  <button className="flex gap-1 items-center cursor-pointer"><FaEye /> View</button>
                </Link>
                <Link to={`/update-query/${query._id}`}>
                  <button className="flex gap-1 items-center cursor-pointer"><FaEdit /> Edit</button>
                </Link>
                <button onClick={() => handleDelete(query._id)} className="flex gap-1 items-center cursor-pointer text-red-500">
                  <FaTrash /> Delete
                </button>
              </div>

            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueries;
