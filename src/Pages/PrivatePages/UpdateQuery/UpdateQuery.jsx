import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import { MdDeleteForever } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';

const UpdateQuery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    boycottReason: '',
    productImage: '',
    queryTitle: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch existing query data
  useEffect(() => {
    fetch(`http://localhost:5000/queries/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          productName: data.productName || '',
          boycottReason: data.boycottReason || '',
          productImage: data.productImage || '',
          queryTitle: data.queryTitle || '',
        });
        setPreviewImage(data.productImage || '');
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch query data');
      });
  }, [id]);

  const uploadImageToImgBB = async file => {
    const apiKey = '35c276788d20fd3df8aed7571cc51938';
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error('Image upload failed');

    return data.data.url;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles, fileRejections, event) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        setFormData(prev => ({ ...prev, productImage: '' }));
      }
      return;
    }

    // অনলাইন ইমেজ থেকে ড্র্যাগ করলে HTML থেকে src বের করা
    const htmlData = event?.dataTransfer?.getData('text/html');
    if (htmlData) {
      const match = htmlData.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1]) {
        const imageUrl = match[1];
        setImageFile(null);
        setPreviewImage(imageUrl);
        setFormData(prev => ({ ...prev, productImage: imageUrl }));
      }
    }
  }, []);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
  });


  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);

    try {
      let imageUrl = formData.productImage;

      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const payload = {
        ...formData,
        productImage: imageUrl,
      };

      const res = await fetch(`http://localhost:5000/queries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error('Update failed: ' + errorText);
        setUpdating(false);
        return;
      }

      const result = await res.json();

      if (result.modifiedCount > 0) {
        toast.success('Query updated successfully!');
        setTimeout(() => navigate(`/query-details/${id}`), 1500);
      } else {
        toast.info('No changes were made.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update query.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-24">
      <ToastContainer/>
      <h2 className="text-3xl font-semibold mb-6 text-center">Update Product Query</h2>
      <form onSubmit={handleUpdate} className="space-y-6 bg-white shadow-xl rounded-2xl p-6">
        <div>
          <label htmlFor="queryTitle" className="block font-medium mb-1">
            Query Title
          </label>
          <input
            type="text"
            name="queryTitle"
            id="queryTitle"
            value={formData.queryTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="productName" className="block font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            id="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="boycottReason" className="block font-medium mb-1">
            Boycott Reason
          </label>
          <textarea
            name="boycottReason"
            id="boycottReason"
            value={formData.boycottReason}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>



        {/* Image Section - URL + File Upload + Preview */}
        <div className="flex flex-col md:flex-row items-start w-full gap-4 my-4">

          {/* URL Section */}
          <div className="flex-1 space-y-2 relative w-full">
            <div className="relative text-center">
              <h3 className="text-lg font-semibold border-b pb-1 mb-6">
                {formData.productImage && !imageFile ? "URL Provided" : "Provide URL"}
              </h3>
            </div>

            <div className="relative input-wrapper w-full">
              <input
                type="url"
                name="productImage"
                value={formData.productImage}
                onChange={handleInputChange}
                className="p-2 py-4 w-full rounded-md focus:outline-none border-b border-gray-600 peer disabled:cursor-not-allowed disabled:bg-gray-600"
                placeholder="Paste image URL here"
                disabled={!!imageFile}
              />

              <label htmlFor="productImage" className="floating-placeholder">Product Image URL</label>

              {formData.productImage && !imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, productImage: '' }));
                    setPreviewImage('');
                  }}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                  title="Clear URL"
                >
                  <MdDeleteForever size={24} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (formData.productName) {
                  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(formData.productName)}`;
                  window.open(url, '_blank');
                } else {
                  toast.info("Enter product name first to search image.");
                }
              }}
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
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-center transition bg-base-200 hover:bg-base-300 ${formData.productImage ? 'pointer-events-none opacity-50 cursor-not-allowed bg-gray-400' : ''
                }`}
            >
              <input {...getInputProps()} disabled={!!formData.productImage} />
              <p className="text-gray-600">Drag & drop an image here or click to upload</p>
            </div>

            {imageFile && !formData.productImage && (
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
            <div className="mx-auto w-32 h-32 flex items-center justify-center border-2 border-dashed rounded text-gray-400">
              <div className="flex flex-col items-center justify-center">
                <span className="loading loading-ring loading-xl"></span>
                <p className="text-sm text-gray-500 mt-2">provide valid URL or upload image file</p>
              </div>
            </div>
          )}
        </div>





        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold transition duration-200"
        >
          {updating ? 'Updating...' : 'Update Query'}
        </button>
      </form>
    </div>
  );
};

export default UpdateQuery;
