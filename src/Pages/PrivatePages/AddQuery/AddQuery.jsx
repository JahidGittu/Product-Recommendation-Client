import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { toast, Bounce, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

const AddQuery = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [boycottReasonText, setBoycottReasonText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [productName, setProductName] = useState('');

    const handleAddQuery = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const productBrand = form.productBrand.value.trim();
        const queryTitle = form.queryTitle.value.trim();
        const boycottReason = form.boycottReason.value.trim();

        if (!productName || !productBrand || !queryTitle || !boycottReason) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all the fields.',
            });
            setLoading(false);
            return;
        }

        if (!imageURL && !imageFile) {
            Swal.fire({
                icon: 'warning',
                title: 'Image Required',
                text: 'Please provide an image URL or upload a file.',
            });
            setLoading(false);
            return;
        }

        let finalImage = '';

        if (imageURL) {
            finalImage = imageURL;
        } else if (imageFile) {
            const imageData = new FormData();
            imageData.append('image', imageFile);

            try {
                const imgRes = await fetch('https://api.imgbb.com/1/upload?key=35c276788d20fd3df8aed7571cc51938', {
                    method: 'POST',
                    body: imageData,
                });
                const imgData = await imgRes.json();

                if (!imgData?.data?.url) {
                    throw new Error("No image URL returned");
                }

                finalImage = imgData?.data?.url;
            } catch (uploadError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Image Upload Failed',
                    text: uploadError.message,
                });
                setLoading(false);
                return;
            }

        }

        const queryData = {
            productName,
            productBrand,
            productImage: finalImage,
            queryTitle,
            boycottReason,
            userEmail: user?.email,
            userName: user?.displayName,
            userPhoto: user?.photoURL,
            timestamp: new Date().toISOString(),
            recommendationCount: 0,
        };

        axios.post('http://localhost:5000/queries', queryData)
            .then(res => {
                toast('🦄 Query added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    transition: Bounce,
                });

                form.reset();
                setBoycottReasonText('');
                setImageURL('');
                setImageFile(null);
                setPreviewImage('');
                setProductName('');
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to post',
                    text: error.message,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isBoycottReasonActive = isFocused || boycottReasonText.length > 0;

    const handleURLChange = (e) => {
        const url = e.target.value;
        setImageURL(url);
        if (url) {
            setImageFile(null);
            setPreviewImage(url);
        }
    };

    // Utility function to silently check if a URL is a valid image
    const isValidImageURL = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);  // If image loads successfully
            img.onerror = () => resolve(false); // If loading fails
            img.src = url;
        });
    };

    useEffect(() => {
        return () => {
            if (previewImage && imageFile) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage, imageFile]);


    const handleURLClick = async () => {
        if (imageURL) return;
        else if (productName === "") return;

        try {
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) return;

            const isValid = await isValidImageURL(clipboardText); // ⬅️ Silent check with <img>

            if (isValid) {
                setImageURL(clipboardText);
                setImageFile(null);
                setPreviewImage(clipboardText);
                toast.success("Image URL pasted from clipboard!");
            } 
            // else {
            //     toast.info("📋 Clipboard doesn't contain a valid image URL");
            // }
        } catch (err) {
            console.error("Clipboard read failed", err);
            toast.error("❌ Could not access clipboard");
        }
    };




    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImageURL('');
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const preventDefaults = (e) => e.preventDefault();
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event =>
            window.addEventListener(event, preventDefaults));
        return () => {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event =>
                window.removeEventListener(event, preventDefaults));
        };
    }, []);






    const handleFindOnGoogle = () => {
        if (productName) {
            const query = encodeURIComponent(productName + ' product');
            window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
        } else {
            toast.warning("Please enter product name first.");
        }

    };



    return (
        <div className="max-w-3xl mx-auto mt-24 bg-base-100 rounded-xl shadow-xl p-8">
            <ToastContainer />
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">Add a New Query</h2>
            <form onSubmit={handleAddQuery} className="space-y-6 *:pt-4">

                {/* Product Name */}
                <div className="relative input-wrapper">
                    <input
                        id="productName"
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="p-2 w-full rounded-md focus:outline-none border-b border-gray-600 peer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="productName" className="floating-placeholder">Product Name</label>
                </div>

                {/* Product Brand */}
                <div className="relative input-wrapper">
                    <input
                        id="productBrand"
                        type="text"
                        name="productBrand"
                        className="p-2 w-full rounded-md focus:outline-none border-b border-gray-600 peer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="productBrand" className="floating-placeholder">Product Brand</label>
                </div>

                {/* URL & File Section with Preview + Google Search Button */}
                <div className="flex flex-col md:flex-row items-start w-full gap-4 my-4">

                    {/* URL Section */}
                    <div className="flex-1 space-y-2 relative w-full">
                        <div className="relative text-center">
                            <h3 className="text-lg font-semibold border-b pb-1 mb-6">{imageURL ? "URL Provided" : "Provide URL"}</h3>
                            {imageURL && (
                                <IoIosCheckmarkCircleOutline className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-green-500 text-xl" />
                            )}
                        </div>

                        <div className="relative input-wrapper w-full" data-tooltip-id="image-url-tip" data-tooltip-content="Disabled because an image file is selected.">
                            <input
                                id="productImageURL"
                                type="url"
                                name="productImageURL"
                                value={imageURL}
                                onChange={handleURLChange}
                                onClick={handleURLClick} // 👈 এই লাইনে ম্যাজিক
                                className="p-2 py-4 w-full rounded-md focus:outline-none border-b border-gray-600 peer disabled:cursor-not-allowed disabled:bg-gray-600"
                                placeholder=" "
                                disabled={!!imageFile}
                            />


                            <label htmlFor="productImageURL" className="floating-placeholder">Product Image URL</label>

                            {imageURL && !imageFile && (
                                <button type="button" onClick={() => {
                                    setImageURL('');
                                    setPreviewImage('');
                                }} className="absolute right-2 top-2 text-red-500 hover:text-red-700" title="Clear URL">
                                    <MdDeleteForever size={24} />
                                </button>
                            )}

                            {!!imageFile && <Tooltip id="image-url-tip" place="top" effect="solid" />}
                        </div>

                        {/* Google Search Button */}
                        <button
                            type="button"
                            onClick={handleFindOnGoogle}
                            className="btn btn-sm mt-2 flex items-center gap-2"
                        >
                            <FaSearch /> Find Image on Google
                        </button>
                    </div>

                    <div className="divider md:divider-horizontal w-full md:w-auto text-center text-gray-500">OR</div>

                    {/* File Upload Section */}
                    <div className="flex-1 space-y-2 relative w-full">
                        <div className="relative text-center">
                            <h3 className="text-lg font-semibold border-b pb-1 mb-6">{imageFile ? "Image Uploaded" : "Upload File"}</h3>
                            {imageFile && (
                                <IoIosCheckmarkCircleOutline className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-green-500 text-xl" />
                            )}
                        </div>

                        <div className="relative input-wrapper w-full" data-tooltip-id="image-file-tip" data-tooltip-content="Disabled because a URL is already provided.">
                            {/* --- File Drop Zone --- */}
                            <div
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file && file.type.startsWith("image/")) {
                                        setImageFile(file);
                                        setImageURL('');
                                        setPreviewImage(URL.createObjectURL(file));
                                        toast.success("🖼️ Image dropped successfully!");
                                    } else {
                                        toast.warning("🚫 Please drop a valid image file.");
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition bg-base-200 hover:bg-base-300 ${imageURL ? 'pointer-events-none opacity-50 cursor-not-allowed bg-gray-400' : ''
                                    }`}>

                                <p className="text-gray-600">Drag & drop an image here from Google Image Search</p>

                                <input
                                    id="productImageFile"
                                    type="file"
                                    accept="image/*"
                                    name="productImageFile"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full rounded-md border-b border-gray-600 focus:outline-none file:cursor-pointer"
                                    disabled={!!imageURL}
                                />
                            </div>


                            <label
                                htmlFor="productImageFile"
                                className="floating-placeholder absolute left-2 top-1 scale-75 -translate-y-18 text-blue-500 transition-all duration-200"
                            >
                                Upload Product Image
                            </label>


                            {imageFile && !imageURL && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreviewImage('');
                                    }}
                                    className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                                    title="Clear Uploaded File"
                                >
                                    <MdDeleteForever size={24} />
                                </button>
                            )}

                            {!!imageURL && <Tooltip id="image-file-tip" place="top" effect="solid" />}
                        </div>
                    </div>
                </div>

                {/* Image Preview */}
                <div className="text-center my-4">
                    {previewImage ? (
                        <>
                            <img
                                src={previewImage}
                                alt="Image Preview"
                                className="mx-auto w-32 h-32 object-cover rounded"
                                onError={() => setPreviewImage('')}
                            />
                            <p className="text-sm text-gray-500 mt-2">Image Preview</p>
                        </>
                    ) : (
                        <div className="mx-auto w-32 h-32 flex items-center justify-center border-2 border-dashed rounded text-gray-400" data-tooltip-id="image-preview-tip" data-tooltip-content="Waiting for Image...">
                            <div className="flex flex-col items-center justify-center">
                                <span className="loading loading-ring loading-xl"></span>
                                <p className="text-sm text-gray-500 mt-2">provide valid URL or upload image file</p>
                            </div>
                            <Tooltip id="image-preview-tip" place="top" effect="solid" />
                        </div>
                    )}
                </div>

                {/* Query Title */}
                <div className="relative input-wrapper">
                    <input
                        id="queryTitle"
                        type="text"
                        name="queryTitle"
                        className="p-2 w-full rounded-md focus:outline-none border-b border-gray-600 peer"
                        placeholder=" "
                        required
                    />
                    <label htmlFor="queryTitle" className="floating-placeholder">Query Title</label>
                </div>

                {/* Boycott Reason */}
                <div className="relative pt-6">
                    <textarea
                        id="boycottReason"
                        name="boycottReason"
                        rows="4"
                        placeholder=" "
                        value={boycottReasonText}
                        onChange={(e) => setBoycottReasonText(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        required
                        className="textarea block w-full appearance-none border-b border-gray-600 bg-transparent p-2 text-sm focus:outline-none focus:ring-0"
                    />
                    <label
                        htmlFor="boycottReason"
                        className={`absolute left-2 z-10 origin-[0] transform transition-all duration-200 ${isBoycottReasonActive ? 'top-1 scale-75 -translate-y-1/2 text-blue-500' : 'top-1/2 -translate-y-1/2 scale-100 text-gray-400'
                            }`}
                    >
                        Boycotting Reason Details
                    </label>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="btn btn-primary w-full py-2">
                    {loading ? "Adding..." : "Add Query"}
                </button>
            </form>
        </div>
    );
};

export default AddQuery;
