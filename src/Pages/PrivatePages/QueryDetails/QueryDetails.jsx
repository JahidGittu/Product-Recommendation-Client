import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../Shared/Loading/Loading';
import { CiLocationArrow1 } from "react-icons/ci";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axios from 'axios';

/**
 * QueryDetails Component
 * ----------------------
 * 
 * ✨ Key Fixes & Enhancements
 * 1. "Like" state is now tracked **per‑recommendation** (previously global – caused all cards to toggle together).
 * 2. Optimistic UI updates roll back on network failure.
 * 3. Comment list is sorted by newest first and appears directly beneath the input.
 * 4. Added simple, Facebook‑style styling tweaks for like / comment rows.
 */

const QueryDetails = () => {
  /* ------------------------------------------------------------------
   * Hooks & state
   * ---------------------------------------------------------------- */
  const { id } = useParams();
  const { user } = useAuth();


  /* ------- edit helpers ------- */
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const [showAllMap, setShowAllMap] = useState({});


  const [query, setQuery] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map of recommendationId → { liked: boolean, count: number }
  const [likesMap, setLikesMap] = useState({});

  /* ------------------------------ Theme --------------------------- */
  
  const toggleShowAll = (recId) => {
    setShowAllMap(prev => ({
      ...prev,
      [recId]: !prev[recId]
    }));
  };



  const saveEdit = async (recId, cmtId) => {
    if (!editText.trim()) return;
    try {
      await axios.patch(`http://localhost:5000/recommendations/${recId}/comment/${cmtId}`, {
        text: editText.trim(),
      });
      setRecommendations(prev =>
        prev.map(r =>
          r._id === recId
            ? {
              ...r,
              comments: r.comments.map(c =>
                c._id === cmtId ? { ...c, text: editText.trim() } : c
              ),
            }
            : r
        )
      );
      setEditingId(null);
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const deleteComment = async (recId, cmtId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`http://localhost:5000/recommendations/${recId}/comment/${cmtId}`);
      setRecommendations(prev =>
        prev.map(r =>
          r._id === recId
            ? { ...r, comments: r.comments.filter(c => c._id !== cmtId) }
            : r
        )
      );
    } catch {
      toast.error('Failed to delete comment');
    }
  };



  /* ------------------------------------------------------------------
   * Fetch query + recommendations
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:5000/queries/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/recommendations?queryId=${id}`).then(res => res.json()),
    ])
      .then(([queryData, recs]) => {
        setQuery(queryData);
        setRecommendations(recs);

        // Build likes map from backend data
        const initialLikes = {};
        recs.forEach((r) => {
          initialLikes[r._id] = {
            liked: r.likes?.includes(user?.email),
            count: r.likes?.length || 0,
          };
        });
        setLikesMap(initialLikes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  /* ------------------------------------------------------------------
   * Image upload / recommendation form state
   * ---------------------------------------------------------------- */
  const [formData, setFormData] = useState({
    title: '',
    productName: '',
    productImage: '',
    reason: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: handleDrop,
    disabled: !!formData.productImage,
  });

  /* ------------------------------------------------------------------
   * Submit recommendation
   * ---------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login first.');

    const { title, productName, reason, productImage } = formData;
    if (!title || !productName || !reason) {
      return toast.warn('Fill in all required fields.');
    }

    setSubmitting(true);
    let imageUrl = productImage;

    // Optional – upload to ImgBB if file selected
    if (!imageUrl && imageFile) {
      try {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=35c276788d20fd3df8aed7571cc51938`, {
          method: 'POST',
          body: imgData,
        });
        const imgResult = await res.json();
        imageUrl = imgResult?.data?.url;
      } catch (err) {
        toast.error('Image upload failed');
        setSubmitting(false);
        return;
      }
    }

    /* Build new recommendation object */
    const newRec = {
      queryId: query._id,
      queryTitle: query.queryTitle,
      productName,
      productImage: imageUrl,
      recommendationTitle: title,
      recommendationReason: reason,
      userEmail: query.userEmail,
      userName: query.userName,
      recommenderEmail: user.email,
      recommenderName: user.displayName || user.email,
      recommenderPhoto: user.photoURL || '',
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    /* Persist to backend */
    try {
      const res = await fetch(`http://localhost:5000/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRec),
      });
      const data = await res.json();

      if (data.insertedId) {

        await axios.patch(`http://localhost:5000/queries/${id}`, { increment: true });
        setQuery(prev => ({
          ...prev,
          recommendationCount: prev.recommendationCount + 1
        }));


        /* Optimistically update UI */
        setRecommendations((prev) => [...prev, { ...newRec, _id: data.insertedId }]);
        setLikesMap((prev) => ({
          ...prev,
          [data.insertedId]: { liked: false, count: 0 },
        }));
        setFormData({ title: '', productName: '', productImage: '', reason: '' });
        setImageFile(null);
        setPreviewImage('');
        toast.success('Recommendation added!');
      } else {
        toast.error('Failed to add recommendation.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding recommendation.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------
   * Like handler
   * ---------------------------------------------------------------- */
  const handleLike = async (recId) => {
    if (!user) return toast.warn('Login first to like');

    // Prevent liking own query (not recommendation) – optional
    // if (query?.userEmail === user?.email) {
    //   return toast.error("You can't like your own post");
    // }

    // Optimistic toggle
    setLikesMap((prev) => {
      const current = prev[recId] || { liked: false, count: 0 };
      const updated = {
        liked: !current.liked,
        count: current.liked ? current.count - 1 : current.count + 1,
      };
      return { ...prev, [recId]: updated };
    });

    try {
      await axios.patch(`http://localhost:5000/recommendations/${recId}/like`, {
        userEmail: user.email,
      });

    } catch (err) {
      /* Rollback on error */
      setLikesMap((prev) => {
        const current = prev[recId];
        return {
          ...prev,
          [recId]: { liked: !current.liked, count: current.liked ? current.count + 1 : current.count - 1 },
        };
      });
      toast.error('Failed to update like');
    }
  };

  /* ------------------------------------------------------------------
   * Comment helpers
   * ---------------------------------------------------------------- */
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const toggleCommentBox = (recId) => {
    setActiveCommentBox((prev) => (prev === recId ? null : recId));
    setCommentInput('');
  };

  const submitComment = async (e, recId) => {
    e.preventDefault();
    if (!user || !commentInput.trim()) return;

    // শুধু text এবং user/timestamp অফার করছি, id সার্ভার দেবে
    const payload = {
      user: user.displayName || user.email,
      text: commentInput.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/recommendations/${recId}/comment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (data.acknowledged && data.comment) {
        setRecommendations((prev) =>
          prev.map((rec) =>
            rec._id === recId
              ? {
                ...rec,
                comments: [...(rec.comments || []), data.comment]
              }
              : rec
          )
        );
        setCommentInput('');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment');
    }
  };


  /* ----------------------------- Render ---------------------------- */
  if (loading) return <Loading />;
  if (!query) return <div className="text-center py-20 text-red-500">Query not found.</div>;

  return (
    <div className="bg-base-100 min-h-screen p-6 md:p-12 mt-24">
      <section className="max-w-4xl mx-auto space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* Query / author header                                        */}
        {/* ------------------------------------------------------------- */}
        <h1 className="text-3xl font-bold mb-2">{query.queryTitle}</h1>
        <div className="flex items-center gap-4 border-b pb-4 border-dashed">
          <img
            src={query.userPhoto}
            alt={query.userName}
            className="w-16 h-16 rounded-full object-cover border border-gray-600"
          />
          <div>
            <h2 className="text-lg font-semibold">{query.userName}</h2>
            <p className="text-sm opacity-70">{query.userEmail}</p>
            <p className="text-xs opacity-50">
              Posted on {new Date(query.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Query details                                                 */}
        {/* ------------------------------------------------------------- */}
        <div>
          <p className="text-xl">
            <strong>Product Name:</strong> {query.productName} ({query.productBrand})
          </p>
          <img
            src={query.productImage}
            alt={query.productName}
            className="w-full max-w-md mx-auto rounded mt-2 shadow"
          />
          <p className="mt-2 text-justify">
            <strong>Boycott Reason:</strong> {query.boycottReason}
          </p>
          <p className="mt-2 text-sm opacity-70">❤️ {query.recommendationCount} recommendations</p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Add recommendation form                                       */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-10 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">Add a Recommendation</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="form-control">
              <label className="label flex items-center">
                <span className="label-text mr-1">Recommendation Title</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="Recommendation title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>

            {/* Product Name */}
            <div className="form-control">
              <label className="label flex items-center">
                <span className="label-text mr-1">Product Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                name="productName"
                type="text"
                placeholder="Product name"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>

            {/* Image (Optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Image (Optional)</span>
              </label>
              <div className="flex justify-between gap-4">
                {/* URL input */}
                <input
                  type="url"
                  name="productImage"
                  placeholder="Paste image URL"
                  value={formData.productImage}
                  onChange={handleChange}
                  disabled={!!imageFile}
                  className=" rounded border px-3 py-2 w-1/2"
                />
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className="p-4 border-2 border-dashed rounded text-center cursor-pointer w-1/2">
                  <input {...getInputProps()} />
                  <p>Drag & drop or click to upload</p>
                </div>
              </div>

              {/* Preview */}
              <div className="text-center mt-4">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-32 h-32 mx-auto rounded object-cover" />
                ) : formData.productImage ? (
                  <img src={formData.productImage} alt="From URL" className="w-32 h-32 mx-auto rounded object-cover" />
                ) : (
                  <p className="text-gray-500">No image preview</p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="form-control">
              <label className="label flex items-center">
                <span className="label-text mr-1">Why Recommend?</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                rows={4}
                placeholder="Why do you recommend this product?"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Recommendation'}
            </button>
          </form>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* Recommendations list                                          */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">All Recommendations</h3>
          {recommendations.length === 0 ? (
            <p className="text-gray-500">No recommendations yet. Be the first!</p>
          ) : (
            <ul className="space-y-6">
              {recommendations.map((rec) => {
                /* Sort comments newest → oldest */
                // ১) টেক্সট লম্বায় সজ্জিত করে পপুলার ধরে নিচ্ছে
                const sortedComments = [...(rec.comments || [])]
                  .sort((a, b) => b.text.length - a.text.length);
                // ২) স্টেট দেখে সব বা প্রথম ৫
                const showAll = !!showAllMap[rec._id];
                const displayedComments = showAll
                  ? sortedComments
                  : sortedComments.slice(0, 5);

                const likeState = likesMap[rec._id] || { liked: false, count: 0 };

                return (
                  <li
                    key={rec._id}
                    className="p-4 rounded-lg shadow border">
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={rec.recommenderPhoto || 'https://via.placeholder.com/40'}
                        alt={rec.recommenderName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-600"
                      />
                      <div>
                        <p className="font-semibold">{rec.recommenderName}</p>
                        <p className="text-xs opacity-60">
                          {format(new Date(rec.timestamp), 'PPP p')}
                        </p>
                      </div>
                    </div>

                    <h4 className="font-semibold text-lg">{rec.recommendationTitle}</h4>
                    <p className="text-sm">
                      <strong>Product:</strong> {rec.productName}
                    </p>
                    {rec.productImage && (
                      <img
                        src={rec.productImage}
                        alt={rec.productName}
                        className="w-48 h-32 object-cover rounded mt-2 shadow"
                      />
                    )}
                    <p className="mt-2 whitespace-pre-line">{rec.recommendationReason}</p>

                    {/* Like + comment actions */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-6 text-sm font-medium">
                        <button
                          onClick={() => handleLike(rec._id)}
                          className="flex items-center gap-1 hover:opacity-80"
                        >
                          {likeState.liked ? (
                            <AiFillLike className="text-blue-600" />
                          ) : (
                            <AiOutlineLike />
                          )}
                          {likeState.count}
                        </button>

                        <button
                          onClick={() => toggleCommentBox(rec._id)}
                          className="btn btn-xs btn-outline"
                        >
                          💬 {sortedComments.length}
                        </button>
                      </div>

                      {/* Comment box */}
                      {activeCommentBox === rec._id && (
                        <div className="mt-3 space-y-3">
                          <form
                            onSubmit={(e) => submitComment(e, rec._id)}
                            className="relative"
                          >
                            <input
                              type="text"
                              className="input bg-base-100 input-bordered w-full pr-10"
                              placeholder="Write a comment…"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              required
                            />
                            <button
                              type="submit"
                              className="absolute right-1 top-1 btn btn-sm min-h-0 h-8 px-2 z-10"
                            >
                              <CiLocationArrow1 size={20} />
                            </button>
                          </form>

                          {/* Comments list */}
                          <ul className="pl-2 space-y-1 border-l border-gray-400">
                            {displayedComments.map((cmt) => (
                              <li key={cmt._id} className="text-sm flex items-start gap-2">
                                {/* যদি এডিট মুডে না থাকে */}
                                {editingId !== cmt._id ? (
                                  <>
                                    <span>
                                      <span className="font-semibold mr-1">{cmt.user}:</span>
                                      {cmt.text}
                                    </span>
                                    {cmt.user === (user.displayName || user.email) && (
                                      <span className="ml-auto space-x-1">
                                        <button
                                          onClick={() => {
                                            setEditingId(cmt._id);
                                            setEditText(cmt.text);
                                          }}
                                          className="text-xs underline"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => deleteComment(rec._id, cmt._id)}
                                          className="text-xs text-red-500 underline"
                                        >
                                          Delete
                                        </button>
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  /* এডিট ইনপুট */
                                  <div className="relative flex-1">
                                    <input
                                      value={editText}
                                      onChange={e => setEditText(e.target.value)}
                                      className="input w-full py-2 pr-20"  // পর্যাপ্ত right-padding দিন
                                    />
                                    <div className="absolute z-10 right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                      <button
                                        onClick={() => saveEdit(rec._id, cmt._id)}
                                        className="btn btn-xs btn-primary"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="btn btn-xs"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>

                                )}
                              </li>
                            ))}


                            {sortedComments.length > 5 && (
                              <button
                                onClick={() => toggleShowAll(rec._id)}
                                className="text-xs text-blue-600 underline mt-1"
                              >
                                {showAll ? 'Show Less' : `Show All (${sortedComments.length})`}
                              </button>
                            )}


                          </ul>

                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default QueryDetails;
