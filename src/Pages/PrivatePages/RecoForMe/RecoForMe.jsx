import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { FaRegEye, FaHeart } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../Shared/Loading/Loading';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Helmet } from 'react-helmet';

export default function RecoForMe() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [view, setView] = useState('table');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    const accessToken = user?.accessToken;
    if (!user?.email) return;
    setLoading(true);
    axios
      .get(`https://product-recommendation-server-topaz.vercel.app/recommendations/for-me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { email: user.email },
      })
      .then(res => setRecs(res.data))
      .catch(() => setError('Failed to load recommendations'))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handleDelete = async rec => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    try {
      await axios.delete(`https://product-recommendation-server-topaz.vercel.app/recommendations/${rec._id}`);
      await axios.patch(`https://product-recommendation-server-topaz.vercel.app/queries/${rec.queryId}`, {
        decrement: true,
      });
      setRecs(prev => prev.filter(r => r._id !== rec._id));
      toast.success('Recommendation deleted successfully');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleLike = async id => {
    try {
      await axios.patch(`https://product-recommendation-server-topaz.vercel.app/recommendations/${id}/like`, {
        email: user.email,
      });
      setRecs(prev =>
        prev.map(r =>
          r._id === id
            ? {
                ...r,
                likes: r.likes.includes(user.email)
                  ? r.likes.filter(e => e !== user.email)
                  : [...r.likes, user.email],
              }
            : r
        )
      );
    } catch {
      toast.error('Like failed');
    }
  };

  const handleCloseModal = () => {
    setModal(null);
    setReviewText('');
    setRating(null);
    setShowReviewForm(false);
    setReviews([]);
    setHasUserReviewed(false);
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      return toast.error('সব ফিল্ড পূরণ করুন');
    }
    setIsSubmitting(true);
    try {
      const payload = {
        recommendationId: modal._id,
        rating: Number(rating),
        reviewText,
        reviewerName: user.displayName,
        reviewerEmail: user.email,
        reviewerPhoto: user.photoURL,
        createdAt: new Date().toISOString(),
      };

      await axios.post('https://product-recommendation-server-topaz.vercel.app/reviews', payload);
      toast.success('রিভিউ সফলভাবে যুক্ত হয়েছে!');
      setReviewText('');
      setRating(null);
      setShowReviewForm(false);
      loadReviews(modal._id);
    } catch (error) {
      if (error.response) {
        toast.error(`রিভিউ পাঠাতে সমস্যা হয়েছে: ${error.response.data.message}`);
      } else {
        toast.error('রিভিউ পাঠাতে সমস্যা হয়েছে');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClass = num => {
    switch (num) {
      case 1:
        return 'bg-error text-error-content';
      case 2:
        return 'bg-warning text-warning-content';
      case 3:
        return 'bg-yellow-400 text-black';
      case 4:
        return 'bg-success text-success-content';
      case 5:
        return 'bg-primary text-primary-content';
      default:
        return 'bg-neutral text-neutral-content';
    }
  };

  const loadReviews = async id => {
    try {
      const res = await axios.get(`https://product-recommendation-server-topaz.vercel.app/reviews/by-recommendation/${id}`);
      setReviews(res.data);
      setHasUserReviewed(res.data.some(r => r.reviewerEmail === user.email));
    } catch {
      setReviews([]);
      setHasUserReviewed(false);
    }
  };

  const handleView = async rec => {
    setModal(rec);
    setReviewText('');
    setRating(null);
    setShowReviewForm(false);
    setHasUserReviewed(false);
    await loadReviews(rec._id);
  };

  const grid = useMemo(() => 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3', []);

  if (loading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-error font-semibold mt-20 text-lg">
        {error}
      </p>
    );
  if (!recs.length)
    return (
      <div className="pt-36 space-y-10 text-center">
        <p className="text-2xl md:text-3xl font-bold">
          No recommendations from others yet.
        </p>
        {/* Uncomment below if you want to encourage adding queries */}
        {/* <p className="text-lg mt-2">Maybe you have no queries.</p>
        <Link to="/add-Query">
          <button className="btn btn-outline btn-primary mt-4">
            ➕ Add New Query
          </button>
        </Link> */}
      </div>
    );

  return (
    <div className="bg-base-100 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto mt-20 space-y-6 rounded-lg shadow-lg">
      <Helmet>
        <title>Recommendations For Me | Recommend Product</title>
      </Helmet>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Recommendations For Me
      </h2>

      <div className="flex justify-center gap-3 mb-4">
        {['table', 'card'].map(v => (
          <button
            key={v}
            className={`btn btn-sm md:btn ${
              view === v ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => setView(v)}
            aria-pressed={view === v}
          >
            {v === 'table' ? 'Table View' : 'Card View'}
          </button>
        ))}
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div className="overflow-x-auto sm:block hidden rounded-lg">
          <table className="min-w-full table-zebra table rounded-lg">
            <thead>
              <tr className="bg-base-300 text-base-content font-semibold">
                {['Recommendation', 'Product', 'Query', 'By', 'Date', 'Action'].map(h => (
                  <th key={h} className="py-3 px-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recs.map(r => (
                <tr key={r._id} className="border-t border-base-300 hover:bg-base-200 cursor-pointer transition-colors duration-150">
                  <td className="py-3 px-4">{r.recommendationTitle}</td>
                  <td className="py-3 px-4">{r.productName}</td>
                  <td className="py-3 px-4">{r.queryTitle}</td>
                  <td className="py-3 px-4">{r.recommenderName}</td>
                  <td className="py-3 px-4">{new Date(r.timestamp).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <div>
                      <button
                      className="btn btn-xs btn-outline btn-info"
                      aria-label="View details"
                      onClick={() => handleView(r)}
                    >
                      <FaRegEye size={16} />
                    </button>
                    <button
                      className="btn btn-xs btn-outline btn-error"
                      aria-label="Delete recommendation"
                      onClick={() => handleDelete(r)}
                    >
                      <MdDelete size={18} />
                    </button>
                    <button
                      className={`btn btn-xs ${
                        r.likes.includes(user.email) ? 'btn-secondary' : 'btn-outline'
                      }`}
                      aria-label={r.likes.includes(user.email) ? 'Unlike' : 'Like'}
                      onClick={() => handleLike(r._id)}
                    >
                      <FaHeart className="text-pink-500" /> {r.likes.length}
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARD VIEW */}
      {(view === 'card' || view === 'table') && (
        <div className={`${view === 'table' ? 'sm:hidden' : ''} ${grid}`}>
          {recs.map(r => (
            <article
              key={r._id}
              className="border border-base-300 rounded-xl p-5 shadow-md flex flex-col bg-card-bg hover:shadow-lg transition-shadow duration-300"
              tabIndex={0}
              aria-label={`Recommendation: ${r.recommendationTitle}`}
            >
              <h3 className="text-lg font-semibold mb-2 text-base-content">{r.recommendationTitle}</h3>
              <p className="text-sm text-base-content">
                <strong>Product: </strong> {r.productName}
              </p>
              <p className="text-sm text-base-content">
                <strong>Query: </strong> {r.queryTitle}
              </p>
              <p className="text-sm text-base-content">
                <strong>By: </strong> {r.recommenderName}
              </p>
              <p className="text-xs mt-1 text-base-content">{new Date(r.timestamp).toLocaleDateString()}</p>
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  className="flex-1 btn btn-sm btn-outline btn-info"
                  aria-label="View details"
                  onClick={() => handleView(r)}
                >
                  View <FaRegEye className="ml-1" />
                </button>
                <button
                  className={`btn btn-sm ${
                    r.likes.includes(user.email) ? 'btn-secondary' : 'btn-outline'
                  }`}
                  aria-label={r.likes.includes(user.email) ? 'Unlike' : 'Like'}
                  onClick={() => handleLike(r._id)}
                >
                  <FaHeart className="text-pink-500" /> {r.likes.length}
                </button>
                <button
                  className="btn btn-sm btn-error text-white hover:bg-error-focus"
                  aria-label="Delete recommendation"
                  onClick={() => handleDelete(r)}
                >
                  <MdDelete />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-base-300 text-base-content w-10 h-10 rounded-full flex items-center justify-center text-3xl font-bold shadow-md hover:bg-base-400 transition-colors duration-200"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="relative w-full max-w-lg bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto focus:outline-none p-6">
            {modal.productImage && (
              <img
                src={modal.productImage}
                alt={modal.productName}
                className="w-full h-48 object-cover rounded-lg mb-5"
              />
            )}
            <h3
              id="modal-title"
              className="text-xl font-semibold text-base-content mb-3"
            >
              {modal.recommendationTitle}
            </h3>
            <p className="text-base-content mb-2">
              <strong>Product: </strong> {modal.productName}
            </p>
            <p className="mb-2">
              <strong>Query: </strong>{' '}
              <Link
                to={`/query-details/${modal.queryId}`}
                className="link link-primary"
              >
                {modal.queryTitle}
              </Link>
            </p>
            <p className="whitespace-pre-line text-base-content mb-3">{modal.recommendationReason}</p>
            <p className="text-xs text-gray-500 mb-4">
              By {modal.recommenderName} · {new Date(modal.timestamp).toLocaleString()}
            </p>

            <button
              id="review-btn"
              className={`btn btn-success btn-sm w-full ${
                hasUserReviewed ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={() => {
                if (!hasUserReviewed) {
                  setShowReviewForm(true);
                } else {
                  toast.info('আপনি ইতিমধ্যেই রিভিউ দিয়েছেন');
                }
              }}
              data-tooltip-id="review-tooltip"
              data-tooltip-content={hasUserReviewed ? 'আপনি ইতিমধ্যেই রিভিউ দিয়েছেন' : ''}
              aria-disabled={hasUserReviewed}
              tabIndex={hasUserReviewed ? -1 : 0}
            >
              রিভিউ দিন
            </button>
            <Tooltip id="review-tooltip" />

            {showReviewForm && !hasUserReviewed && (
              <div className="space-y-3 border-t pt-4">
                <div className="rating gap-1 flex justify-center">
                  {[1, 2, 3, 4, 5].map(num => (
                    <input
                      key={num}
                      type="radio"
                      name="rating"
                      className={`mask mask-heart cursor-pointer ${getColorClass(num)}`}
                      aria-label={`${num} star`}
                      value={num}
                      checked={Number(rating) === num}
                      onChange={() => setRating(num)}
                    />
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="textarea textarea-bordered w-full resize-none"
                  placeholder="আপনার রিভিউ লিখুন"
                  rows={4}
                ></textarea>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'পাঠানো হচ্ছে...' : 'সাবমিট রিভিউ'}
                </button>
              </div>
            )}

            {reviews.length > 0 && (
              <div className="border-t mt-6 pt-4 space-y-4 max-h-72 overflow-y-auto">
                <h4 className="font-semibold text-base-content">রিভিউসমূহ:</h4>

                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="bg-base-200 border border-base-300 rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex gap-3 items-center relative">
                      <img
                        src={r.reviewerPhoto || 'https://i.ibb.co/t4C8Fhg/default-user.png'}
                        alt={r.reviewerName}
                        className="w-10 h-10 rounded-full border object-cover"
                      />

                      <div className="flex-1">
                        <h5 className="text-sm mt-1 font-medium text-base-content">
                          {r.reviewerName}
                        </h5>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < r.rating ? 'text-yellow-400' : 'text-gray-400'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 absolute right-2 top-2">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-2 text-base-content whitespace-pre-line">
                      {r.reviewText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
