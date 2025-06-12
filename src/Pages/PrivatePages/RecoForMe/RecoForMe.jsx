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
    if (!user?.email) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/recommendations/for-me`, {
        params: { email: user.email },
      })
      .then(res => setRecs(res.data))
      .catch(() => setError('Failed to load recommendations'))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handleDelete = async rec => {
    if (!confirm('Delete this recommendation?')) return;
    try {
      await axios.delete(`http://localhost:5000/recommendations/${rec._id}`);
      await axios.patch(`http://localhost:5000/queries/${rec.queryId}`, {
        decrement: true,
      });
      setRecs(prev => prev.filter(r => r._id !== rec._id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleLike = async id => {
    try {
      await axios.patch(`http://localhost:5000/recommendations/${id}/like`, {
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

      await axios.post('http://localhost:5000/reviews', payload);
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
        return 'bg-red-400';
      case 2:
        return 'bg-orange-400';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-lime-400';
      case 5:
        return 'bg-green-400';
      default:
        return 'bg-gray-300';
    }
  };

  const loadReviews = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/reviews/by-recommendation/${id}`);
      setReviews(res.data);
      setHasUserReviewed(res.data.some(r => r.userEmail === user.email));
    } catch {
      setReviews([]);
      setHasUserReviewed(false);
    }
  };

  const handleView = async (rec) => {
    setModal(rec);
    setReviewText('');
    setRating(null);
    setShowReviewForm(false);
    setHasUserReviewed(false);
    await loadReviews(rec._id);
  };


  const grid = useMemo(() => 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3', []);

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!recs.length) return <p className="text-center py-20">No recommendations from others yet.</p>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto mt-20 space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Recommendations For Me</h2>

      <div className="flex justify-center gap-3">
        {['table', 'card'].map(v => (
          <button
            key={v}
            className={`btn btn-sm md:btn ${view === v ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView(v)}
          >
            {v === 'table' ? 'Table View' : 'Card View'}
          </button>
        ))}
      </div>

      {view === 'table' && (
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                {['Recommendation', 'Product', 'Query', 'By', 'Date', 'Action'].map(h => (
                  <th key={h} className="py-2 px-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recs.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="py-2 px-3">{r.recommendationTitle}</td>
                  <td className="py-2 px-3">{r.productName}</td>
                  <td className="py-2 px-3">{r.queryTitle}</td>
                  <td className="py-2 px-3">{r.recommenderName}</td>
                  <td className="py-2 px-3">{new Date(r.timestamp).toLocaleDateString()}</td>
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex gap-2">
                      <button className="btn btn-xs btn-outline" onClick={() => handleView(r)}>
                        <FaRegEye size={14} />
                      </button>
                      <button className="btn btn-xs btn-error text-white" onClick={() => handleDelete(r)}>
                        <MdDelete size={14} />
                      </button>
                      <button
                        className={`btn btn-xs ${r.likes.includes(user.email) ? 'btn-secondary' : 'btn-outline'}`}
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

      {(view === 'card' || view === 'table') && (
        <div className={`${view === 'table' ? 'sm:hidden' : ''} ${grid}`}>
          {recs.map(r => (
            <div key={r._id} className="bg-white shadow rounded-xl p-4 flex flex-col">
              <h3 className="text-lg font-semibold">{r.recommendationTitle}</h3>
              <p className="text-sm text-gray-600">
                <strong>Product:</strong> {r.productName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Query:</strong> {r.queryTitle}
              </p>
              <p className="text-sm text-gray-600">
                <strong>By:</strong> {r.recommenderName}
              </p>
              <p className="text-xs text-gray-500 mt-1">{new Date(r.timestamp).toLocaleDateString()}</p>
              <div className="mt-auto flex gap-2 pt-4">
                <button className="flex-1 btn btn-sm btn-outline" onClick={() => handleView(r)}>
                  View <FaRegEye className="ml-1" />
                </button>
                <button
                  className={`btn btn-sm ${r.likes.includes(user.email) ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => handleLike(r._id)}
                >
                  <FaHeart className="text-pink-500" /> {r.likes.length}
                </button>
                <button className="btn btn-sm bg-red-500 text-white hover:bg-red-600" onClick={() => handleDelete(r)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-10">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gray-400 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xl sm:text-2xl"
            onClick={handleCloseModal}
          >
            &times;
          </button>
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            {modal.productImage && (
              <img src={modal.productImage} alt={modal.productName} className="w-full h-48 object-cover rounded-t-xl" />
            )}
            <div className="p-6 space-y-4 text-sm sm:text-base">
              <h3 className="text-xl font-semibold">{modal.recommendationTitle}</h3>
              <p>
                <strong>Product:</strong> {modal.productName}
              </p>
              <p>
                <strong>Query:</strong>{' '}
                <Link to={`/query-details/${modal.queryId}`} className="link link-primary">
                  {modal.queryTitle}
                </Link>
              </p>
              <p className="whitespace-pre-line">{modal.recommendationReason}</p>
              <p className="text-xs text-gray-500">
                By {modal.recommenderName} · {new Date(modal.timestamp).toLocaleString()}
              </p>


              <button
                id="review-btn"
                className={`btn btn-success btn-sm w-full ${hasUserReviewed ? ' cursor-not-allowed opacity-50' : ''}`}
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
                        className={`mask mask-heart ${getColorClass(num)}`}
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
                    className="textarea textarea-bordered w-full"
                    placeholder="আপনার রিভিউ লিখুন"
                  ></textarea>
                  <button className="btn btn-primary w-full" onClick={handleSubmitReview} disabled={isSubmitting}>
                    {isSubmitting ? 'পাঠানো হচ্ছে...' : 'সাবমিট রিভিউ'}
                  </button>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="border-t mt-4 pt-3 space-y-2">
                  <h4 className="font-semibold">রিভিউসমূহ:</h4>

                 {reviews.map((r, i) => (
  <div key={i} className="bg-gray-50 border rounded-lg p-4">
    <div className="flex gap-3 items-center relative">
      <img
        src={r.reviewerPhoto || 'https://i.ibb.co/t4C8Fhg/default-user.png'}
        alt={r.reviewerName}
        className="w-10 h-10 rounded-full border object-cover"
      />
      <div className="flex-1">
        <h5 className="text-sm mt-1 font-medium">{r.reviewerName}</h5>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Number(r.rating) ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs text-gray-500 absolute right-2 top-2">
        {new Date(r.createdAt).toLocaleDateString()}
      </span>
    </div>
    <p className="text-sm mt-2 text-gray-700 whitespace-pre-line">{r.reviewText}</p>
  </div>
))}

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
