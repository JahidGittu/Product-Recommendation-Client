import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../Shared/Loading/Loading';

const QueryDetails = ({ theme = 'light' }) => {
    const { id } = useParams();
    const { user } = useAuth();

    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        productName: '',
        productImage: '',
        reason: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Theme
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
    const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

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

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
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
        disabled: !!formData.productImage
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first.");
            return;
        }

        if (!formData.title || !formData.productName || !formData.reason) {
            alert("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);

        let imageUrl = formData.productImage;

        if (!imageUrl && imageFile) {
            // Upload image to ImgBB
            const imgData = new FormData();
            imgData.append('image', imageFile);

            try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, {
                    method: 'POST',
                    body: imgData
                });
                const imgResult = await res.json();
                imageUrl = imgResult?.data?.url;
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("Image upload failed.");
                setSubmitting(false);
                return;
            }
        }

        const newRec = {
            queryId: id,
            queryTitle: query.queryTitle,
            productName: formData.productName,
            productImage: imageUrl,
            recommendationTitle: formData.title,
            recommendationReason: formData.reason,
            userEmail: query.userEmail,
            userName: query.userName,
            recommenderEmail: user.email,
            recommenderName: user.displayName || user.email,
            recommenderPhoto: user.photoURL || '',
            timestamp: new Date().toISOString(),
        };


        try {
            const res = await fetch(`http://localhost:5000/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRec),
            });
            const data = await res.json();

            if (data.insertedId) {
                await fetch(`http://localhost:5000/queries/${id}/incrementRecommendation`, { method: 'PATCH' });

                setRecommendations(prev => [...prev, newRec]);
                setFormData({ title: '', productName: '', productImage: '', reason: '' });
                setImageFile(null);
                setPreviewImage('');
                alert("Recommendation added!");
            } else {
                alert("Failed to add recommendation.");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding recommendation.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;
    if (!query) return <div className="text-center py-20 text-red-500">Query not found.</div>;

    return (
        <div className={`${bgColor} min-h-screen p-6 md:p-12 mt-24 ${textColor}`}>
            <section className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">{query.queryTitle}</h1>

                {/* User Info */}
                <div className="flex items-center gap-4 border-b pb-4">
                    <img src={query.userPhoto} alt={query.userName} className="w-16 h-16 rounded-full object-cover border border-gray-600" />
                    <div>
                        <h2 className="text-xl font-semibold">{query.userName}</h2>
                        <p className="text-sm opacity-70">{query.userEmail}</p>
                        <p className="text-xs opacity-50">
                            Posted on {new Date(query.timestamp).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Query Details */}
                <div>
                    <p className='text-xl'><strong>Product Name:</strong> {query.productName} ({query.productBrand})</p>
                    <img src={query.productImage} alt={query.productName} className="w-full max-w-md mx-auto rounded mt-2" />
                    <p className="mt-2 text-justify "><strong>Boycott Reason:</strong> {query.boycottReason}</p>
                    <p className="mt-2 text-sm opacity-70">❤️ {query.recommendationCount} Recommendations</p>
                </div>

                {/* Recommendation Form */}
                <div className={`mt-10 p-6 rounded-lg shadow ${cardBg}`}>
                    <h3 className="text-2xl font-semibold mb-4">Add a Recommendation</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="title" type="text" placeholder="Recommendation title" value={formData.title} onChange={handleChange} className={`w-full rounded border px-3 py-2 ${inputBg} ${textColor} border ${borderColor}`} required />
                        <input name="productName" type="text" placeholder="Product name" value={formData.productName} onChange={handleChange} className={`w-full rounded border px-3 py-2 ${inputBg} ${textColor} border ${borderColor}`} required />

                        {/* Image Section */}
                        <div className="flex gap-4 flex-col md:flex-row">
                            <div className="flex-1">
                                <input
                                    type="url"
                                    name="productImage"
                                    placeholder="Paste image URL"
                                    value={formData.productImage}
                                    onChange={handleChange}
                                    disabled={!!imageFile}
                                    className={`w-full rounded border px-3 py-2 ${inputBg} ${textColor} border ${borderColor}`}
                                />
                                <button type="button" onClick={() => {
                                    if (formData.productName) {
                                        const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(formData.productName)}`;
                                        window.open(url, '_blank');
                                    }
                                }} className="btn btn-sm mt-2">🔍 Search Image</button>
                            </div>

                            <div className="flex-1">
                                <div {...getRootProps()} className="p-4 border-2 border-dashed rounded bg-base-200 text-center cursor-pointer">
                                    <input {...getInputProps()} />
                                    <p>Drag and drop or click to upload image</p>
                                </div>
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

                        <textarea name="reason" rows={4} placeholder="Why do you recommend this product?" value={formData.reason} onChange={handleChange} className={`w-full rounded border px-3 py-2 ${inputBg} ${textColor} border ${borderColor}`} required />

                        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Recommendation'}
                        </button>
                    </form>
                </div>

                {/* All Recommendations */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">All Recommendations</h3>
                    {recommendations.length === 0 ? (
                        <p className="text-gray-500">No recommendations yet. Be the first!</p>
                    ) : (
                        <ul className="space-y-6">
                            {recommendations.map((rec, i) => (
                                <li key={i} className={`p-4 rounded-lg shadow ${cardBg} border ${borderColor}`}>
                                    <div className="flex items-center gap-4 mb-2">
                                        <img src={rec.recommenderPhoto || 'https://via.placeholder.com/40'} alt={rec.recommenderName} className="w-10 h-10 rounded-full object-cover border border-gray-600" />
                                        <div>
                                            <p className="font-semibold">{rec.recommenderName}</p>
                                            <p className="text-xs opacity-60">{format(new Date(rec.timestamp), 'PPP p')}</p>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-xl">{rec.recommendationTitle}</h4>
                                    <p className='text-lg'><strong>Product:</strong> {rec.productName}</p>
                                    {rec.productImage && (
                                        <img src={rec.productImage} alt={rec.productName} className="w-48 h-32 object-cover rounded mt-2" />
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
