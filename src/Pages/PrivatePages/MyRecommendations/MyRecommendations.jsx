import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../../Shared/Loading/Loading';
import { FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { FcLike } from "react-icons/fc";
import { FaRegCommentDots } from "react-icons/fa";

const MyRecommendations = () => {
  const { user } = useAuth();

  /* state */
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeRec, setActiveRec] = useState(null);
  const [viewSection, setViewSection] = useState('reviews');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!activeRec?._id) return;

    axios
      .get(`http://localhost:5000/reviews/by-recommendation/${activeRec._id}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [activeRec]);


  /* fetch */
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);

    axios
      .get(`http://localhost:5000/recommendations`, { params: { recommenderEmail: user.email } })
      .then((res) => setRecs(res.data))
      .catch(() => setError('Failed to fetch recommendations'))
      .finally(() => setLoading(false));
  }, [user?.email]);

  /* preview - এখন পুরো recommendation অবজেক্ট নিবে */
  const openPreview = (rec) => {
    setActiveRec(rec);
    setPreviewOpen(true);
  };

  /* delete */
  const handleDelete = (recId, queryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete your recommendation permanently! Once it's gone, even (Ctrl+Z) can't revert this.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
      .then((result) => {
        if (!result.isConfirmed) return;

        axios
          .delete(`http://localhost:5000/recommendations/${recId}`)
          .then(() => {
            // Decrement recommendation count on the query
            axios.patch(`http://localhost:5000/queries/${queryId}`, { decrement: true });
            setRecs((prev) => prev.filter((r) => r._id !== recId));
            Swal.fire('Deleted!', 'Your recommendation was deleted.', 'success');
          })
          .catch(() => Swal.fire('Error', 'Failed to delete recommendation', 'error'));
      });
  };




  /* UI states */
  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!recs.length) return <p className="text-center py-20">No recommendations found.</p>;

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto mt-24 space-y-8">
      <h2 className="text-center text-3xl font-bold">My Recommendations</h2>

      {/* view toggle */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setViewMode('table')}
          className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode('card')}
          className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline'}`}
        >
          Card View
        </button>
      </div>

      {/* ------------------------ TABLE VIEW ------------------------ */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full table bg-base-100  text-sm">
            <thead>
              <tr className="bg-base-300 text-left font-semibold">
                <th className="py-3 px-4">Title</th>
                {/* hide on xs */}
                <th className="py-3 px-4 hidden sm:table-cell">Product</th>
                <th className="py-3 px-4 hidden md:table-cell">Query</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recs.map((rec) => (
                <tr key={rec._id} className="border-t">
                  <td className="py-2 px-4">{rec.recommendationTitle}</td>
                  <td className="py-2 px-4 hidden sm:table-cell">{rec.productName}</td>
                  <td className="py-2 px-4 hidden md:table-cell">{rec.queryTitle}</td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPreview(rec)}
                        data-tooltip-id="preview-tip"
                        data-tooltip-content="Preview"
                        className="btn btn-xs btn-outline"
                      >
                        <FaRegEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rec._id, rec.queryId)}
                        data-tooltip-id="delete-tip"
                        data-tooltip-content="Delete"
                        className="btn btn-xs bg-red-500 text-white hover:bg-red-600"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------ CARD VIEW ------------------------ */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recs.map((rec) => (
            <div
              key={rec._id}
              className="flex flex-col justify-between rounded-xl p-4 shadow"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{rec.recommendationTitle}</h3>
                <p className="text-sm ">
                  <strong>Product:</strong> {rec.productName}
                </p>
                <p className="text-sm ">
                  <strong>Query:</strong> {rec.queryTitle}
                </p>
                <p className="text-xs ">
                  {new Date(rec.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openPreview(rec)}
                  data-tooltip-id="preview-tip"
                  data-tooltip-content="Preview"
                  className="btn btn-sm flex-1 btn-outline"
                >
                  <FaRegEye size={18} />
                </button>
                <button
                  onClick={() => handleDelete(rec._id, rec.queryId)}
                  data-tooltip-id="delete-tip"
                  data-tooltip-content="Delete"
                  className="btn btn-sm flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* tooltips */}
      <Tooltip id="preview-tip" place="top" />
      <Tooltip id="delete-tip" place="top" />

      {/* ------------------------ PREVIEW MODAL ------------------------ */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          />
          <button
            onClick={() => setPreviewOpen(false)}
            className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full text-2xl  shadow-lg"
          >
            &times;
          </button>

          <div className="relative bg-base-300 z-40 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-xl  shadow-lg">
            {activeRec ? (
              <>
                {activeRec.productImage && (
                  <img
                    src={activeRec.productImage}
                    alt={activeRec.productName}
                    className="h-44 w-full object-cover sm:h-56 rounded-t-xl"
                  />
                )}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {activeRec.recommenderPhoto && (
                      <img
                        src={activeRec.recommenderPhoto}
                        alt={activeRec.recommenderName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{activeRec.recommendationTitle}</p>
                      <p className=" text-sm">
                        By <span className="font-medium">{activeRec.recommenderName || activeRec.userName}</span> ·{' '}
                        {new Date(activeRec.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-xl font-semibold">{activeRec.productName}</p>
                  <p className="italic ">{activeRec.queryTitle}</p>

                  <p className="whitespace-pre-line ">
                    {activeRec.recommendationReason || activeRec.recommendationText || 'No detailed reason provided.'}
                  </p>

                  {/* ----------- REVIEW & LIKE+COMMENT TOGGLE ----------- */}
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between max-w-md mx-auto space-x-4">
                      <button
                        className={`py-2 px-4 font-semibold ${viewSection === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setViewSection('reviews')}
                      >
                        রিভিউ
                      </button>
                      <button
                        className={`py-2 px-4 font-semibold ${viewSection === 'likesComments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                        onClick={() => setViewSection('likesComments')}
                      >
                        লাইক + কমেন্ট
                      </button>
                    </div>

                    {/* রিভিউ সেকশন */}
                    {viewSection === 'reviews' && (
                      <>
                        {reviews.length > 0 ? (
                          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                            {reviews.map((r, i) => (
                              <div key={i} className="bg-gray-50 border rounded-lg p-4 ">
                                <div className="flex gap-3 items-center relative">
                                  <img
                                    src={r.userPhoto || 'https://i.ibb.co/t4C8Fhg/default-user.png'}
                                    alt={r.userName}
                                    className="w-10 h-10 rounded-full border object-cover"
                                  />

                                  <div className="flex-1">
                                    <h5 className="text-sm mt-1 font-medium">{r.userName}</h5>
                                    <div className="flex items-center gap-1 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <span className="text-xs text-gray-500 absolute right-2 top-2">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mt-2 text-gray-700 whitespace-pre-line">{r.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-center text-gray-500">কোনো রিভিউ পাওয়া যায়নি।</p>
                        )}
                      </>
                    )}

                    {/* লাইক + কমেন্ট সেকশন */}
                    {viewSection === 'likesComments' && (
                      <div className="mt-4 max-h-72 overflow-y-auto p-3 rounded-md bg-gray-100 space-y-6">

                        <div className='flex justify-between'>
                          {/* Likes */}
                          <div className='w-1/2'>
                            <h4 className="font-semibold flex justify-center items-center gap-2 text-lg text-red-500">
                              <FcLike /> {activeRec.likes?.filter(Boolean).length || 0} Likes
                            </h4>
                            {activeRec.likes && activeRec.likes.filter(Boolean).length > 0 ? (
                              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700">
                                {activeRec.likes.filter(Boolean).map((email, i) => (
                                  <li key={i}>{email}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500 mt-1">No likes yet.</p>
                            )}
                          </div>

                          <div className="divider divider-horizontal"></div>

                          {/* Comments */}
                          <div className='w-1/2'>
                            <h4 className="font-semibold flex justify-center items-center gap-2 text-lg text-blue-600">
                              <FaRegCommentDots /> {activeRec.comments?.length || 0} Comments
                            </h4>
                            {activeRec.comments && activeRec.comments.length > 0 ? (
                              <div className="mt-2 space-y-3">
                                {activeRec.comments.map((comment, i) => (
                                  <div key={i} className="border rounded p-2 md:px-5 bg-white shadow-sm w-full">
                                    <p className="font-semibold text-sm text-gray-800">{comment.user}</p>
                                    <p className="text-gray-700 text-sm">{comment.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-1">No comments yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  {/* ----------------------------------------------- */}
                </div>
              </>
            ) : (
              <div className="flex h-52 items-center justify-center">
                <span className="loading loading-ring loading-lg" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

};

export default MyRecommendations;
